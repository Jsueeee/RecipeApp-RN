/**
 * HTML 엔티티를 디코딩하는 유틸리티 함수
 * 서버에서 받은 HTML 엔티티가 포함된 문자열을 일반 문자로 변환
 */
export const escapeHtml = (input: string | null | undefined): string => {
  if (!input) return "";
  let output = input;
  output = output.replace(/&#39;/g, "'");
  output = output.replace(/&quot;/g, '"');
  output = output.replace(/&amp;/g, "&");
  output = output.replace(/&nbsp;/g, " ");
  output = output.replace(/&#035;/g, "#");
  output = output.replace(/&gt;/g, ">");
  output = output.replace(/&lt;/g, "<");
  // 추가 HTML 엔티티들
  output = output.replace(/&apos;/g, "'");
  output = output.replace(/&#x27;/g, "'");
  output = output.replace(/&#x2F;/g, "/");
  output = output.replace(/&#x60;/g, "`");
  output = output.replace(/&#x3D;/g, "=");
  output = output.replace(/&#x2B;/g, "+");
  output = output.replace(/&#x2D;/g, "-");
  output = output.replace(/&#x5F;/g, "_");
  output = output.replace(/&#x7E;/g, "~");
  output = output.replace(/&#x21;/g, "!");
  output = output.replace(/&#x40;/g, "@");
  output = output.replace(/&#x24;/g, "$");
  output = output.replace(/&#x25;/g, "%");
  output = output.replace(/&#x5E;/g, "^");
  output = output.replace(/&#x28;/g, "(");
  output = output.replace(/&#x29;/g, ")");
  output = output.replace(/&#x5B;/g, "[");
  output = output.replace(/&#x5D;/g, "]");
  output = output.replace(/&#x7B;/g, "{");
  output = output.replace(/&#x7D;/g, "}");
  output = output.replace(/&#x7C;/g, "|");
  output = output.replace(/&#x5C;/g, "\\");
  output = output.replace(/&#x3A;/g, ":");
  output = output.replace(/&#x3B;/g, ";");
  output = output.replace(/&#x2C;/g, ",");
  output = output.replace(/&#x2E;/g, ".");
  output = output.replace(/&#x3F;/g, "?");
  return output;
};
