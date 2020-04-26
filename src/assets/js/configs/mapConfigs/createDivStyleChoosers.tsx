export const divStyleMaker = (imageFile: string): any => {
  const divStyle = document.createElement("div");
  divStyle.style.backgroundImage = `url(images/${imageFile})`;
  divStyle.style.border = "2px hsla(12, 95%, 47%, 0.93) solid";
  divStyle.style.width = "70px";
  divStyle.style.height = "70px";
  divStyle.style.borderRadius = "50%";
  divStyle.style.margin = "6px";
  return divStyle;
};
