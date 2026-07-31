#!/usr/bin/env python3
"""生成 PDF 导出字体子集所需的字符集文件。

报告正文来自用户录入与大模型生成，字符不可预知，因此按「GB2312 全字符集 +
常用符号区段」取子集，而非按当前页面出现过的字符取子集。
"""

import sys

# GB2312 覆盖 6763 个简体汉字与 682 个符号，足以覆盖报告正文
GB2312_HI = range(0xA1, 0xFA)
GB2312_LO = range(0xA1, 0xFF)

# GB2312 未覆盖但正文/标点中常见的区段
EXTRA_RANGES = [
    (0x0020, 0x007E),  # ASCII 可见字符
    (0x00A0, 0x00FF),  # Latin-1 补充（· × ÷ ° 等）
    (0x2010, 0x206F),  # 通用标点（— – ' ' " " • … ‰ 等）
    (0x2100, 0x214F),  # 字母式符号（℃ ™ № 等）
    (0x2190, 0x21FF),  # 箭头
    (0x2200, 0x22FF),  # 数学运算符
    (0x2460, 0x24FF),  # 带圈数字
    (0x25A0, 0x25FF),  # 几何图形（■ □ ● ○ ◆ 等）
    (0x2600, 0x26FF),  # 杂项符号（★ ☆ 等）
    (0x2700, 0x27BF),  # 装饰符号（✓ ✗ 等）
    (0x3000, 0x303F),  # CJK 标点
    (0xFF00, 0xFFEF),  # 全角字符
]


def build_charset() -> set[str]:
    """收集子集化所需的全部字符"""
    chars: set[str] = set()

    for hi in GB2312_HI:
        for lo in GB2312_LO:
            try:
                chars.add(bytes([hi, lo]).decode("gb2312"))
            except UnicodeDecodeError:
                continue

    for start, end in EXTRA_RANGES:
        for code in range(start, end + 1):
            chars.add(chr(code))

    return chars


def main() -> None:
    if len(sys.argv) != 2:
        print("usage: pdf-font-charset.py <output-file>", file=sys.stderr)
        raise SystemExit(1)

    chars = build_charset()
    with open(sys.argv[1], "w", encoding="utf-8") as fp:
        fp.write("".join(sorted(chars)))

    print(f"charset: {len(chars)} characters -> {sys.argv[1]}")


if __name__ == "__main__":
    main()
