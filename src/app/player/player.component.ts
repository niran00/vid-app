// import { Component, OnInit } from "@angular/core";
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-player',
//   templateUrl: './player.component.html',
//   styleUrls: ['./player.component.scss']
// })
// export class PlayerComponent implements OnInit {
//   videoPath: string | null = null;
//   videoTitle: string | null = null;

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.videoPath = params['filePath'];
//       this.videoTitle = params['title'];
//     });

//     console.log(this.videoPath);
//   }
// }

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  videoPath: string | null = null;
  videoTitle: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoPath = params['filePath'];
      this.videoTitle = params['title'];
    });

    console.log( this.videoPath);
    console.log( this.videoTitle);
  }
}
