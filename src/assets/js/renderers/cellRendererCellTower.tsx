/* eslint-disable no-unused-vars */
const cellsRendererMandatory = (
   _row: any,
   _columnfield: any,
   value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   if (value === "true") {
      return `<span style="font-size: 1.25rem; margin-left: 0px; color: hsla(12, 95%, 47%, 0.98);">
        <i class="fas fa-times"></i>
      </span>`;
   } else if (value === "false") {
      return `<span style="font-size: 1.25rem; margin-left: 0px; color: #2DD462;">
      <i class="fas fa-check"></i>
     </span>`;
   } else {
      return `<span style="font-size: 1.25rem; margin-left: 0px; color: #000000;">
      <i class="fas fa-question"></i>
     </span>`;
   }
};

export default cellsRendererMandatory;
