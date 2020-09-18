import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { ArrayType } from '@angular/compiler';

import { startWith, map } from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { HttpHandlerService } from 'src/app/services/http-handler.service';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  colorCtrl = new FormControl();
  filteredcolors: Observable<string[]>;
  colors: string[] = ['Black'];
  allcolors: string[] = ['White', 'Red', 'Aqua'];
  @ViewChild('colorInput', {static: false}) colorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  mobileForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private httpHandler:HttpHandlerService
    ) { 
    this.filteredcolors = this.colorCtrl.valueChanges.pipe(
      startWith(null),
      map((color: string | null) => color ? this._filter(color) : this.allcolors.slice()));
  }
  
  
  ngOnInit() {
    this.mobileForm = this.fb.group({
      general:this.fb.group({
        brand:['',Validators.required],
        modelName:['',Validators.required],
        modelNumber:['',Validators.required],
      }),
      
      variants:this.fb.array([
        this.initVariant()
      ]),
      displayFeatures:this.fb.group({
        size:[null,Validators.required],
        resolution:['',Validators.required],
      }),
      osAndProcessor:this.fb.group({
        os:['',Validators.required],
        version:[null,Validators.required],
        psrName:['',Validators.required],
        psrBrand:['',Validators.required],
        core:['',Validators.required],
      }),
      camera:this.fb.group({
        primaryCamera:['',Validators.required],
        secondaryCamera:['',Validators.required],  
      }),
      networkFeatures:this.fb.group({
        networkGen:['',Validators.required],
        connectivity:['',Validators.required],
      }),
      dimension:this.fb.group({
        width:[null,Validators.required],
        height:[null,Validators.required],
        thickness:[null,Validators.required],
        weight:[null,Validators.required],
      }),
      brandWarranty:this.fb.group({
        brandWarranty:[null,Validators.required],  
      })
    })
  }
  initVariant(){
    return this.fb.group({
      price:[0,Validators.required],
      internalStorage:[0,Validators.required],
      expandableMemory:[0,Validators.required],
      ram:[0,Validators.required],
      available:[0,Validators.required],
    })
  }
  addVariant() {
    const control = <FormArray>this.mobileForm.controls.variants;
    control.push(this.initVariant());
  }
  removeVariant(i: number) {
    const control = <FormArray>this.mobileForm.controls.variants;
    control.removeAt(i);
  }
  
  add(event: MatChipInputEvent): void {
    // Add color only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our color
      if ((value || '').trim()) {
        this.colors.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.colorCtrl.setValue(null);
    }
  }

  remove(color: string): void {
    const index = this.colors.indexOf(color);

    if (index >= 0) {
      this.colors.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.colors.push(event.option.viewValue);
    this.colorInput.nativeElement.value = '';
    this.colorCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allcolors.filter(color => color.toLowerCase().indexOf(filterValue) === 0);
  }
  async onAddMobileSubmit(){
    this.mobileForm.value.colors = this.colors
    await this.httpHandler.addMobileHandler(this.mobileForm.value);
  }
}
