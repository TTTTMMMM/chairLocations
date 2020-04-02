import * as React from "react";

import JqxFileUpload, {
   IFileUploadProps,
} from "jqwidgets-scripts/jqwidgets-react-tsx/jqxfileupload";
import JqxPanel from "jqwidgets-scripts/jqwidgets-react-tsx/jqxpanel";

class App extends React.PureComponent<{}, IFileUploadProps> {
   //    private myFileUpload = React.createRef<JqxFileUpload>();
   private myPanel = React.createRef<JqxPanel>();

   constructor(props: {}) {
      super(props);
      this.onSelect = this.onSelect.bind(this);
      this.onUploadStart = this.onUploadStart.bind(this);

      this.state = {
         width: "25%",
         localization: {
            browseButton: "Browse",
            uploadButton: "Clean and Upload to Firebase",
            cancelButton: "Cancel",
         },
      };
   }

   render() {
      return (
         <div>
            <JqxFileUpload
               ref="myFileUpload"
               width={this.state.width}
               height={"100%"}
               theme={"energyblue"}
               onSelect={this.onSelect}
               fileInputName={"fileToUpload"}
               uploadUrl={"upload.php"}
               onUploadStart={this.onUploadStart}
               localization={this.state.localization}
            />
            <div style={{ float: "left", marginLeft: "50px" }}>
               <div
                  style={{
                     marginTop: "10px",
                     fontFamily: "Josefin Sans",
                     fontSize: "smaller",
                  }}
               >
                  Events log:
               </div>
               <JqxPanel ref={this.myPanel} width={300} height={150} />
            </div>
         </div>
      );
   }

   private onSelect(event: any): void {
      this.myPanel.current!.append(
         `${event.args.file} ${event.args.size} <br/>`
      );
      console.dir(event);
   }

   private onUploadStart(event: any): void {
      this.myPanel.current!.append(`${event.type} <br/>`);
   }
}

export default App;
