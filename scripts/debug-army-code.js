
function decodeVarInt(buffer, offset) {
  let b1 = buffer[offset++];
  if (b1 < 128) return [b1, offset];
  let b2 = buffer[offset++];
  return [((b1 & 0x7F) << 8) | b2, offset];
}

function decodeString(buffer, offset) {
  let [length, newOffset] = decodeVarInt(buffer, offset);
  offset = newOffset;
  let str = "";
  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(buffer[offset++]);
  }
  return [str, offset];
}

const base64 = "axZrZXN0cmVscy1jb2xvbmlhbC1mb3JjZQEAgSwBAQoBgaUBAgACgaUBAwADgaUBAQAEgaUBAQAFgaUBAQAGgaUBAQAHgaUBAQAIgaUBAQAJgaUBAQAKgaUBAQA=";
const binaryString = atob(base64);
const buffer = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

let offset = 0;
let [sectoralId, newOffset] = decodeVarInt(buffer, offset);
offset = newOffset;
let [sectoralName, newOffset2] = decodeString(buffer, offset);
offset = newOffset2;
let [armyName, newOffset3] = decodeString(buffer, offset);
offset = newOffset3;
let [points, newOffset4] = decodeVarInt(buffer, offset);
offset = newOffset4;
let [groupCount, newOffset5] = decodeVarInt(buffer, offset);
offset = newOffset5;

console.log("Sectoral:", sectoralId, sectoralName);
console.log("Army Name:", armyName);
console.log("Points:", points);
console.log("Groups:", groupCount);

for (let i = 0; i < groupCount; i++) {
  let [groupNumber, newOffset6] = decodeVarInt(buffer, offset);
  offset = newOffset6;
  offset += 2; // Skip unknown
  let [memberCount, newOffset7] = decodeVarInt(buffer, offset);
  offset = newOffset7;
  console.log("Group", groupNumber, "Members:", memberCount);
  for (let m = 0; m < memberCount; m++) {
    offset++; // 00
    let [unitId, newOffset8] = decodeVarInt(buffer, offset);
    offset = newOffset8;
    let [groupChoice, newOffset9] = decodeVarInt(buffer, offset);
    offset = newOffset9;
    let [optionChoice, newOffset10] = decodeVarInt(buffer, offset);
    offset = newOffset10;
    offset++; // 00
    console.log(`  Unit ID: ${unitId}, Group: ${groupChoice}, Option: ${optionChoice}`);
  }
}
