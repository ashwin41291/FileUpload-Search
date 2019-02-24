import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  resolution: any = null;
  iso: any = null;
  grade: any = null;
  data: any = null;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('works');
    this.route.params.subscribe(params => {
      if (params['data']) {
        this.data = params['data']
      } else {
        this.data = null;
      }
    });
  }

  search(): void {
    if (this.data) {
      Object.keys(this.data).forEach(key => {
        console.log(this.data[key]);
      })
    }
  }
}
