/* eslint-disable no-unused-vars */
const cellsRendererMandatory = (
   _row: any,
   _columnfield: any,
   value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   if (value) {
      return `<span style="font-size: 1.25rem; margin-left: 15px; color: #2DD462;">
       <i class="fas fa-check"></i>
      </span>`;
   } else {
      return `<span style="font-size: 1.25rem; margin-left: 15px; color: #D89327;">
        <i class="fas fa-times"></i>
      </span>`;
   }
};

export default cellsRendererMandatory;
