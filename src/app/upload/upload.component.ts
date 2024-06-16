// import { Component } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { throwError } from "rxjs";
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-upload',
//   templateUrl: './upload.component.html',
//   styleUrls: ['./upload.component.scss']
// })
// export class UploadComponent {

//   status: "initial" | "uploading" | "success" | "fail" = "initial";
//   file: File | null = null;

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit(): void {}

//   onChange(event: any) {
//     const file: File = event.target.files[0];

//     if (file) {
//       this.status = "initial";
//       this.file = file;
//       this.file.name;
//     }
//   }

//   // onUpload() {
//   //   if (this.file) {
//   //     const formData = new FormData();
//   //     formData.append("file", this.file, this.file.name);

//   //     const upload$ = this.http.post<{ message: string, file: string, title: string }>("http://localhost:3000/upload", formData);

//   //     this.status = "uploading";

//   //     upload$.subscribe({
//   //       next: (response) => { // Accept response as a parameter here
//   //         this.status = "success";
//   //         this.router.navigate(['/player'], { queryParams: { filePath: response.file, title: response.title } });
//   //       },
//   //       error: (error: any) => {
//   //         this.status = "fail";
//   //         return throwError(() => error);
//   //       },
//   //     });
//   //   }
//   // }

//   onUpload() {
//     if (this.file) {
//       const formData = new FormData();
//       formData.append("file", this.file, this.file.name);
  
//       const upload$ = this.http.post<{ message: string, file: string, title: string }>("http://localhost:3000/upload", formData);
  
//       this.status = "uploading";
  
//       upload$.subscribe({
//         next: (response) => {
//           this.status = "success";
//           this.router.navigate(['/player'], { queryParams: { filePath: response.file, title: response.title } });
//         },
//         error: (error: any) => {
//           this.status = "fail";
//           return throwError(() => error);
//         },
//       });
//     }
//   }
  
// }

import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  status: "initial" | "uploading" | "success" | "fail" = "initial";
  file: File | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  onChange(event: any) {
    const file: File = event.target.files[0];
    const maxSize = 100 * 1024 * 1024; // 100 MB

    if (file && file.size <= maxSize) {
      this.status = "initial";
      this.file = file;
      this.file.name;
    } else {
      // Handle file size error
    }
  }

  onUpload() {
    if (this.file) {
      const formData = new FormData();
      formData.append("file", this.file, this.file.name);

      const upload$ = this.http.post<{ message: string, file: string, title: string }>("http://localhost:3000/upload", formData);

      this.status = "uploading";

      upload$.subscribe({
        next: (response) => {
          this.status = "success";
          this.router.navigate(['/player'], { queryParams: { filePath: response.file, title: response.title } });
          // Reset file input
          const fileInput: any = document.getElementById('fileInput');
          if (fileInput) {
            fileInput.value = null;
          }
        },
        error: (error: any) => {
          this.status = "fail";
          return throwError(() => error);
        },
      });
    }
  }
}

