/* eslint-disable no-unused-vars */
const cellsRendererKeep = (
   _row: any,
   _columnfield: any,
   value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   // console.log(`    cellsRendererKeep(): row<${_row}> value<${value}>`);
   if (value) {
      return `<span style="font-size: 1.25rem; margin-left: 15px; color: #2DD462;">
       <i class="fas fa-check-square"></i>
      </span>`;
   } else {
      return `<span style="font-size: 1.25rem; margin-left: 15px; color: hsla(12, 95%, 47%, 0.98);">
        <i class="fas fa-times-circle"></i>
      </span>`;
   }
};

export default cellsRendererKeep;
