#!/usr/bin/env python3
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

SPEED = "0.18"
DELAY = "2.5"
RETURN_TO_HORIZON = "0.04"
CACHE_TAG = "autorotate-20260908"


def patch_xml(xml_path: Path) -> int:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    count = 0

    for panorama in root.findall("panorama"):
        autorotate = panorama.find("autorotate")
        if autorotate is None:
            autorotate = ET.Element("autorotate")
            children = list(panorama)
            insert_at = next(
                (index for index, child in enumerate(children) if child.tag == "animation"),
                len(children),
            )
            panorama.insert(insert_at, autorotate)

        autorotate.attrib.clear()
        autorotate.attrib.update(
            {
                "speed": SPEED,
                "delay": DELAY,
                "returntohorizon": RETURN_TO_HORIZON,
                "horizonfromdefview": "1",
                "startloaded": "1",
                "useanimation": "0",
            }
        )
        count += 1

    ET.indent(tree, space="  ")
    tree.write(xml_path, encoding="UTF-8", xml_declaration=True)
    return count


def patch_index(index_path: Path) -> bool:
    text = index_path.read_text(encoding="utf-8")
    updated, count = re.subn(
        r'pano\.readConfigUrlAsync\("pano\.xml(?:\?[^"\\]*)?"\);',
        f'pano.readConfigUrlAsync("pano.xml?ts={CACHE_TAG}");',
        text,
        count=1,
    )
    if count:
        index_path.write_text(updated, encoding="utf-8")
    return bool(count)


def main() -> int:
    output_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "_site/pano2vr")
    xml_path = output_dir / "pano.xml"
    index_path = output_dir / "index.html"

    if not xml_path.is_file():
        raise SystemExit(f"Pano2VR config not found: {xml_path}")
    if not index_path.is_file():
        raise SystemExit(f"Pano2VR index not found: {index_path}")

    panorama_count = patch_xml(xml_path)
    cache_busted = patch_index(index_path)
    print(
        f"Pano2VR autorotation enabled on {panorama_count} panoramas "
        f"(speed={SPEED}, delay={DELAY}s, cache_busted={cache_busted})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
