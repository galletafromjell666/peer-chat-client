import { RcFile } from "antd/es/upload";

export const downloadFileFromUrl = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getDataDownloadUrl = (data: RcFile | Uint8Array) => {
  const url = URL.createObjectURL(new Blob([data]));
  return url;
};
