#!/usr/bin/env bash
#
# 生成 PDF 导出所用的中文字体子集。
#
# pdfmake 内置的 Roboto 不含任何汉字，必须自带字体；而完整的 Noto Sans SC
# 可变字体有 18MB，直接上线过大。本脚本把它实例化为 Regular/Bold 两个静态
# 字重，再按 GB2312 + 常用符号取子集，各约 2.2MB，产物落到 public/fonts/。
#
# 依赖：curl、python3、fonttools（pip install fonttools brotli）
# 用法：bash scripts/build-pdf-fonts.sh
#
# 产物已提交到仓库，仅在需要更换字体或调整字符集时才需重新执行。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
OUT_DIR="$ROOT_DIR/public/fonts"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

SOURCE_URL="https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"

command -v pyftsubset >/dev/null 2>&1 || {
  echo "缺少 pyftsubset，请先执行：pip install fonttools brotli" >&2
  exit 1
}

mkdir -p "$OUT_DIR"

echo "==> 下载 Noto Sans SC 可变字体"
curl -sSL -o "$WORK_DIR/source.ttf" "$SOURCE_URL"

echo "==> 生成字符集"
python3 "$SCRIPT_DIR/pdf-font-charset.py" "$WORK_DIR/charset.txt"

build_weight() {
  local weight="$1"
  local name="$2"

  echo "==> 实例化 wght=$weight"
  python3 -m fontTools.varLib.instancer \
    "$WORK_DIR/source.ttf" "wght=$weight" \
    -o "$WORK_DIR/$name.ttf" >/dev/null

  echo "==> 子集化 $name"
  # PDF 输出为矢量，不需要 hinting；字形布局由 pdfmake 计算，不需要 GSUB/GPOS
  pyftsubset "$WORK_DIR/$name.ttf" \
    --text-file="$WORK_DIR/charset.txt" \
    --output-file="$OUT_DIR/$name.ttf" \
    --no-hinting \
    --layout-features='' \
    --drop-tables+=GSUB,GPOS,BASE,vhea,vmtx,VORG \
    --name-IDs='' \
    --notdef-outline
}

build_weight 400 NotoSansSC-Regular
build_weight 700 NotoSansSC-Bold

echo "==> 完成"
ls -lh "$OUT_DIR"
