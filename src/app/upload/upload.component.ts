import { Component, OnInit } from '@angular/core';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
import {Router} from '@angular/router';
import * as GC from '@grapecity/spread-sheets';
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';

const URL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  title = 'upload';
  totalInventories: number;
  spreadBackColor = 'aliceblue';
  data: any = null;
  hostStyle = {
    width: '95vw',
    height: '80vh'
  };
  private spread: GC.Spread.Sheets.Workbook;
  private excelIO;

  constructor(private router: Router) {
    this.excelIO = new Excel.IO();
  }
  public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false;
    // this.onFileChange(file);
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         this.onFileChange(item);
         alert('File uploaded successfully');
         // this.router.navigate(['/search']);
     };
 }
 // onFileChange(file: any) {
 //    const reader: FileReader = new FileReader();
 //    reader.onload = (e: any) => {
 //        /* read workbook */
 //        const bstr: string = e.target.result;
 //        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
 //
 //        /* grab first sheet */
 //        const wsname: string = wb.SheetNames[0];
 //        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
 //
 //        /* save data */
 //        const data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
 //        this.totalInventories = data.length > 0 ? data.length - 1 : 0;
 //
 //        console.log(this.totalInventories);
 //    };
 //    if (file._file) {
 //        const da = reader.readAsBinaryString(file._file);
 //        console.log(da);
 //    }
 // }
 onFileChange(args) {
    const self = this, file = args.srcElement && args.srcElement.files && args.srcElement.files[0];
    if (self.spread && file) {
      self.excelIO.open(file, (json) => {
        this.data = json.sheets.Sheet1.data.dataTable;
        console.log(this.data);
        self.spread.fromJSON(json, {});
        setTimeout(() => {
          alert('load successfully');
        }, 0);
      }, (error) => {
        alert('load fail');
      });
    }
  }
}
