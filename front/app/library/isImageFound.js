import Image from "next/image";
import noCover from "../../public/noCover.jpeg";
import isObjectEmpty from "./isObjectEmpty";

export default function isImageFound(data, width, height, alt) {
  if (isObjectEmpty(data.cover)) {
    return <Image src={noCover} width={width} height={height} alt="No cover cover" />;
  } else {
    return <Image src={data.cover.large || data.cover.medium || data.cover.small} width={width} height={height} alt={alt} />;
  }
}
