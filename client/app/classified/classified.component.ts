import { Component, OnInit } from '@angular/core';

import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ClassifiedService } from '../services/classified.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { AuthService } from '../services/auth.service';
import {niceDateFormatPipe} from '../pipes/niceDateFormatPipe.pipe';
import { SidebarService} from '../services/sidebar.service';

const URL = 'http://127.0.0.1:3000/api/files';


@Component({
  selector: 'app-classified',
  templateUrl: './classified.component.html',
  styleUrls: ['./classified.component.css']
})
export class ClassifiedComponent implements OnInit {

  uploadedImagesThumbnails = [];
  sidebarState = {};
  classified = {};
  classifieds = [];
  isLoading = false;
  isEditing = false;
  search = {};

  addClassifiedForm: FormGroup;
  searchClassifiedsForm: FormGroup;
  searchRequest = new FormControl(" ");
  classifiedTitle = new FormControl('', Validators.required);
  classifiedContent = new FormControl('', Validators.required);
  classifiedCategoryId = new FormControl ('');
  filename = new FormControl();
  timestamp = new FormControl('', Validators.required);
  classifiedPrice = new FormControl('', Validators.required);
  value = new FormControl('', Validators.required);
  url = new FormControl('', Validators.required);
  geotag = new FormControl('', Validators.required);

  menuState = false;



  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  constructor(
      private sidebarData: SidebarService,
      private auth: AuthService,
      private classifiedService: ClassifiedService,
      private formBuilder: FormBuilder,
      private http: Http,
      public toast: ToastComponent ) { }

  ngOnInit() {
    this.getClassifieds();
    this.addClassifiedForm = this.formBuilder.group({
      userId: this.auth.currentUser._id,
      classifiedTitle: this.classifiedTitle,
      classifiedCategoryId: this.classifiedCategoryId,
      classifiedContent: this.classifiedContent,
      classifiedMedia: this.filename,
      classifiedTimestamp: Date.now(),
      classifiedValue: this.value,
      classifiedPrice: this.classifiedPrice,
      classifiedUrl: this.url,
      classifiedGeotag: this.geotag,
  });
    this.sidebarData.currentSidebarState.subscribe(sidebarState => {
      this.sidebarState = sidebarState;
      console.log('сайдбар изменился ' + this.sidebarState + ' @classified.component');
      this.filterClassifieds();
    });
    this.searchClassifiedsForm = this.formBuilder.group({
      searchRequest: this.searchRequest
    });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('Item uploaded successfully' + response);
      this.filename.setValue(response);
      this.uploadedImagesThumbnails.push(response);
    };
  }

  getClassifieds () {
    this.classifiedService.getClassifieds().subscribe(
      data => this.classifieds = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addClassified() {
    this.classifiedService.addClassified(this.addClassifiedForm.value).subscribe(
      res => {
        const newClassified = res.json();
        this.classifieds.push(newClassified);
        this.addClassifiedForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteClassified(classified) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.classifiedService.deleteClassified(classified).subscribe(
        res => {
          const pos = this.classifieds.map(elem => { return elem._id; }).indexOf(classified._id);
          this.classifieds.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  enableEditing(classified) {
    this.isEditing = true;
    this.classified = classified;
  }

  cancelEditing() {
    this.isEditing = false;
    this.classified = {};
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getClassifieds();
  }

  editClassified(classified) {
    this.classifiedService.editClassified(classified).subscribe(
      res => {
        this.isEditing = false;
        this.classified = classified;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  searchClassifieds() {
    this.classifiedService.searchClassifieds(this.searchClassifiedsForm.value).subscribe(
        data => this.classifieds = data
    );
    console.log(this.searchClassifiedsForm.value);
  }

  // фильтрация объявлений по изменению сайдбара

  filterClassifieds() {
    this.classifiedService.filterClassifieds(this.sidebarState).subscribe(
      data => this.classifieds = data
    );
  }

}
