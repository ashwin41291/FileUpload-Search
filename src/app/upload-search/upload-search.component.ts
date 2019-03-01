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
  resol: any = null;
  tempiso: any = null;
  foundResolution: boolean = false;
  foundIso: boolean = false;

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

  loopData(mode): any {
    let dataObj = Array.from(Object.keys(this.data));
    let length = dataObj.length;
    if (mode === 'all') {
      for(let key of dataObj) {
        let row = this.data[key];
        if (this.resol === row[0].value) {
          this.foundResolution = true;
          if (this.tempiso === row[1].value) {
            this.foundIso = true;
            this.grade = row[2].value;
            this.showGrade = true;
            return this.grade;
          }
        }
        if (this.tempiso === row[1].value) {
          this.foundIso = true;
        }
      }
    } else if (mode === 'resolution') {
      let max = 0;
      let min = 0;
      if (this.resol < this.data[dataObj[0]][0].value) {
        this.tempiso = this.data[dataObj[0]][1].value;
        this.foundIso = true;
        return this.data[dataObj[0]][0].value;
      } else if (this.resol > this.data[dataObj[length - 1]][0].value) {
        this.tempiso = this.data[dataObj[length - 1]][1].value;
        this.foundIso = true;
        return this.data[dataObj[length - 1]][0].value;
      } else {
        for(let key of dataObj) {
          let row = this.data[key];
          if (this.resol === row[0].value) {
            return this.resol;
          } else if (min !== 0 && this.resol < row[0].value) {
            max = row[0].value;
            let diff1 = this.resol - min;
            let diff2 = max - this.resol;
            if (diff1 <= diff2) {
              this.foundIso = true;
              return min;
            } else {
              this.tempiso = row[1].value;
              this.foundIso = true;
              return max;
            }
          } else if (this.resol > row[0].value) {
            min = row[0].value;
            this.tempiso = row[1].value;
          }
        }
      }
    } else {
       let max = 0;
          let min = 0;
      for(let key of dataObj) {
        let row = this.data[key];
        if (this.resol === row[0].value) {
          if (min === 0 && this.tempiso < row[1].value) {
            return row[1].value;
          } else if (this.tempiso > row[1].value) {
            min = row[1].value;
          } else {
            max = row[1].value;
            let diff1 = this.tempiso - min;
            let diff2 = max - this.tempiso;
            if (diff1 <= diff2) {
              return min;
            } else {
              return max;
            }
          }
        }
      }
      if (min !== 0) {
        return min;
      }
    }

  }

  search(): void {
    this.showGrade = false;
    this.showError = false;
    this.resol = this.resolution;
    this.tempiso = this.iso;
    this.foundIso = false;
    this.foundResolution = false;
    if (this.data) {
      this.loopData('all');
      if (!this.showGrade) {
        if (!this.foundResolution) {
          this.resol = this.loopData('resolution');
        }
        if (!this.foundIso) {
          this.tempiso = this.loopData('iso');
        }
        this.loopData('all');
      }
    }
  }
}
