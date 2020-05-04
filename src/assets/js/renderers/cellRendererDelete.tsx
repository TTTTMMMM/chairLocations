/* eslint-disable no-unused-vars */
const cellsRendererDelete = (
   _row: any,
   _columnfield: any,
   _value: any,
   _defaulthtml: any,
   _columnproperties: any,
   _rowdata: any
) => {
   return `<span style="font-size: 1.0rem; margin-left: 5px; color: hsla(12, 95%, 47%, 0.93); cursor: pointer;">
    <i class="fas fa-trash"></i>
       </span>`;
};

export default cellsRendererDelete;
