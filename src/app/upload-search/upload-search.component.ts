import {Component, OnInit} from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import * as Excel from '@grapecity/spread-excelio';
import '@grapecity/spread-sheets-charts';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload-search',
  templateUrl: './upload-search.component.html',
  styleUrls: ['./upload-search.component.css']
})
export class UploadSearchComponent implements OnInit {
  spreadBackColor = 'aliceblue';
  data: any = null;
  iso: any = null;
  resolution: any = null;
  grade: any = null;
  showGrade: boolean = false;
  showSearch: boolean = false;
  showError: boolean = false;

  hostStyle = {
    width: '95vw',
    height: '80vh'
  };
  private spread: GC.Spread.Sheets.Workbook;
  private excelIO;

  constructor(private router: Router) {
    this.excelIO = new Excel.IO();
  }

  ngOnInit() {
  }

  workbookInit(args) {
    const self = this;
    self.spread = args.spread;
    const sheet = self.spread.getActiveSheet();
  }

  onFileChange(args) {
    const self = this, file = args.srcElement && args.srcElement.files && args.srcElement.files[0];
    if (self.spread && file) {
      self.excelIO.open(file, (json) => {
        this.data = json.sheets.Sheet1.data.dataTable;
        console.log(this.data);
        self.spread.fromJSON(json, {});
        this.showSearch = true;
        setTimeout(() => {
          alert('Uploaded successfully');
        }, 0);
      }, (error) => {
        alert('Upload failed');
      });
    }
  }

  search(): void {
    this.showGrade = false;
    this.showError = false;
    if (this.data) {
      Object.keys(this.data).forEach(key => {
        let row = this.data[key];
        if (this.resolution === row[0].value) {
          if (this.iso === row[1].value) {
            this.grade = row[2].value;
            this.showGrade = true;
            return;
          }
        }
      });
      if (!this.showGrade) {
        this.showError = true;
      }
    }
  }
}
