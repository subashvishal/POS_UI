import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Renderer2, resolveForwardRef, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { StatusMessage } from '../Const/Messages';
import { PathConstants } from '../const/PathConstants';
import { TableConstants } from '../Const/TableConstants';
import { RestAPIService } from '../shared-services/restAPI.service';
import { getDevices, UsbScanner } from 'usb-barcode-scanner';
import Keyboard from 'simple-keyboard';
import { DatePipe } from '@angular/common';
var fs = require('fs');
import { PosPrinter, PosPrintData, PosPrintOptions } from "electron-pos-printer";
// import * as path from "path";
// const { remote } = require('electron')


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  SalesMode: any = 'START';
  MainMenu: any = [];
  LoginUser: any;
  TopMenu: any = [];
  menuTitle: any = [];
  menuTempTitle: any = [];
  sideMenu: any = [];
  MenuColor: any = [];
  ColorCode: any;
  menu: any;
  Price: any = 0;
  Cost: any = 0;
  CostLabel: any;
  menuSub: any;
  singleCost1: any = [];
  doubleCost1: number[];
  singleCost2: any = [];
  doubleCost2: any = [];
  MainMenuBlock: boolean;
  enableMain: boolean = true;
  enableSide: boolean = false;
  enableCost: boolean = false;
  DescriptionData: any = [];
  ItemData: any = [];
  ItemColumn: any;
  onPlanetTime: Date;
  loading: boolean;
  Description: any = "";
  ItemSno: number = 1;
  AllItem: any = [];
  Total: any = 0;
  TempTotal: number;
  TempDisc: number = 0.00;
  NearTotal: number = 0;
  NextNear: any = 0;
  LastTotal: number = 0;
  Paid: any = 0.00;
  TotalDiscount: any = 0.00;
  ChangeAmount: any = 0.00;
  EnableChangeAmount: boolean = false;
  CostAdd: any;
  PaymentType: string = 'CASH';
  T_No: any;
  PostedSales: any = [];

  BarcodeData: any = [];
  BarcodeDescription: any = [];
  vendorList: any = [];
  vendorColumn: any = [];
  enableVendor: boolean = false;

  enableLogin: boolean = true;
  User: any;
  Pass: any;
  UserName: any;
  Password: any;
  Email: any;
  UserID: any;
  CPassword: any;

  data: any;

  name: any;
  Desc: any;
  enableHome: boolean = false;
  enableSignUp: boolean = false;

  value = "";
  value2 = "";
  keyboard: Keyboard;

  //Table
  first = 0;
  rows = 10;

  //buttons
  TransListData: any = [];
  TransSubListData: any = [];
  TransColumn: any = [];
  SubTransColumn: any = [];
  enableTrans: boolean = false;
  functionalTitle: any = [];
  enablePetCash: boolean = false;
  Cashbooze: any = [];
  enablePettyHead: boolean = true;
  enablePetty: boolean = false;
  enableFunction: boolean = true;
  functionButtons: any = [];
  ButtonColor: any = [];
  suspendTotal: any = 0;
  suspendNearTotal: number = 0;
  suspendNextNear: number = 0;
  suspendLast: number = 0;
  suspense: boolean = false;
  suspended: any = [];
  enablePriceCheck: boolean = false;
  PriceDescription: any;
  addDesc: boolean = false;
  enablePriceAdd: boolean = false;
  PriceDes: any;
  PriceDescData: any = [];
  Quantity: any = 0;

  DescriptionCost: number;
  DrawerCash: any = [];
  flewReason: any;

  //SalesMode
  enableSalesHead: boolean = false;
  enableSales: boolean = false;
  SalesCash: any;
  SaleLabel: any;


  enableLineDiscount: boolean = false;
  enableTotalDiscount: boolean = false;
  enableCentDiscount: boolean = false;
  TotalDiscontAmount: any;

  SelectedRowItem: any = [];
  LineDiscontAmount: any;
  CentDiscontAmount: any;
  productDialog: boolean = false;
  submitted: boolean;
  statuses: any[];


  enableClearPermission: boolean = false;


  @ViewChild("scrollDiv") private myScrollContainer: ElementRef;
  disableAccept: boolean = false;
  keys: string[];
  _utilService: any;

  //INsert
  DescData: any = [];
  PetCash: number;

  position: string;
  displayMaximizable: boolean;
  displayPosition: boolean;

  //clock
  clock: any;

  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;

  constructor(private tableconstant: TableConstants, private restAPI: RestAPIService, private PathConstants: PathConstants,
    private messageService: MessageService, private datepipe: DatePipe, private confirmationService: ConfirmationService) { }

  ngAfterViewInit() {
    this.scrollToBottom();
    // this.keyboard = new Keyboard({
    //   onChange: input => this.onChange(input),
    //   onKeyPress: button => this.onKeyPress(button)
    // });
  }

  // onChange = (input: string) => {
  //   this.value = input;
  //   // this.Password = input
  //   // this.value2 = input;
  //   console.log("Input changed", input);
  // };

  // onKeyPress = (button: string) => {
  //   console.log("Button pressed", button);

  //   /**
  //    * If you want to handle the shift and caps lock buttons
  //    */
  //   if (button === "{shift}" || button === "{lock}") this.handleShift();
  // };

  onInputChange = (event: any) => {
    // this.keyboard.setInput(event.target.value);
  };

  // handleShift = () => {
  //   let currentLayout = this.keyboard.options.layoutName;
  //   let shiftToggle = currentLayout === "default" ? "shift" : "default";

  //   this.keyboard.setOptions({
  //     layoutName: shiftToggle
  //   });
  // };

  ngOnInit() {
    if (this.enableLogin == false) {
      this.onPlanetTime = new Date();
      this.clock = this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss');
      this.scrollToBottom();
      this.onMenuGet();
      this.onSideMenu();
      this.onItem();
      // this.onVendor();
      this.MenuColor = ['green', '#58FA58', '#9A2EFE', '#FF8000', '#FF0040', '#81DAF5', 'green', '#58FA58', '#9A2EFE', '#FF8000',
        '#2E2E2E', '#81DAF5', 'green', '#58FA58', '#9A2EFE', '#3B0B17', '#2E2E2E', '#81DAF5', 'green', '#58FA58', '#FF0040', '#3B0B17',
        '#2E2E2E', '#81DAF5'];
      this.doubleCost1 = [5.00, 10.00, 15.00, 20.00, 25.00];
      this.doubleCost2 = [30.00, 35.00, 40.00, 45.00, 50.00];
      this.singleCost1 = ['1', '2', '3', '4', '5'];
      this.singleCost2 = ['6', '7', '8', '9', '0'];
      this.ItemColumn = this.tableconstant.ItemDescriptionColumn;
      this.ItemData.id;
      this.statuses = [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
      ];

      this.sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
      ];
      // var connectedHidDevices = getDevices()

      //print devices
      // console.log(connectedHidDevices)

      //initialize new usbScanner - takes optional parmeters vendorId and hidMap - check source for details
      // let scanner = new UsbScanner({
      //   vendorId: 1155,
      //   productId: 22352
      //   //   /** You could also initialize the scanner by giving entering the path variable:
      //   //    *  path: 'IOService:/AppleACPI etc...'
      //   //   **/
      // });

      //scanner emits a data event once a barcode has been read and parsed
      // scanner.on("data", function (code) {
      //   console.log("recieved code : " + code);
      //   let letCode = document.getElementById("codeInput").focus();
      //   this.ItemData.push(letCode);
      // });
    }
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  // TimeCtrl($scope, $timeout) {
  //   $scope.clock = "loading clock..."; // initialise the time variable
  //   $scope.tickInterval = 1000 //ms

  //   var tick = function () {
  //     $scope.clock = Date.now() // get the current time
  //     $timeout(tick, $scope.tickInterval); // reset the timer
  //   }

  //   // Start the timer
  //   $timeout(tick, $scope.tickInterval);
  // }


  onRowSelect(event) {
    this.SelectedRowItem = event.data;
    this.messageService.clear();
    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: this.SelectedRowItem.Description + " Selected" });
    // this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
  }

  onRowUnselect(event) {
    this.messageService.clear();
    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: "Item Unselected" });

    // this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.name });
  }

  editProduct(response) {
    this.SelectedRowItem = { ...response };
    this.productDialog = true;
  }

  deleteProduct(SelectedRowItem) {
    if (this.ItemData.length == 0) {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: 'Add Item to Remove', life: 3000 });
    } else if (SelectedRowItem === null) {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: 'Select Item to Remove', life: 3000 });
    } else if (SelectedRowItem.length != 0) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete ' + SelectedRowItem.Description + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.ItemData = this.ItemData.filter(val => val.Sno !== SelectedRowItem.Sno);
          let Amount = 0.00;
          Amount = SelectedRowItem.Amount - 0.00 * SelectedRowItem.Amount;
          this.Total = this.Total - Amount;
          var totCost = this.Total;
          var totdisCost = this.TotalDiscount;
          var totval = totCost.toFixed(2);
          var totdis = totdisCost.toFixed(2);
          this.TempTotal = +totval;
          this.Total = this.TempTotal;
          this.TempDisc = +totdis;
          this.TotalDiscount = this.TempDisc - this.SelectedRowItem.Discount;
          this.NearTotal = Math.round(this.Total);
          this.NearTotal = parseInt(this.Total + 1);
          if (this.NearTotal % 10 === 0) {
            this.NextNear = this.NearTotal + 10;
          } else {
            this.NextNear = this.Total / 10;
            this.NextNear = parseInt(this.NextNear);
            this.NextNear = (this.NextNear * 10 + 10);
          }
          this.LastTotal = this.NextNear + 10;
          this.Description = "";
          this.Desc = this.SelectedRowItem.Description + ' @ ' + this.SelectedRowItem.Price;
          this.SelectedRowItem = {};
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: 'Item Deleted', life: 3000 });
        }
      });
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: 'Select Item to Remove', life: 3000 });
    }
  }

  // deleteSelectedProducts() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected Item?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.ItemData = this.ItemData.filter(val => { !this.SelectedRowItem.includes(val) });
  //       this.SelectedRowItem = [];
  //       this.messageService.clear();
  //       this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage, life: 3000 });
  //     }
  //   });
  // }


  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    let Qty = this.SelectedRowItem.Quantity;
    let Amount = 0.00;
    this.SelectedRowItem.Amount = this.SelectedRowItem.Amount - 0.00 * this.SelectedRowItem.Amount;
    if (this.SelectedRowItem !== undefined) {
      if (this.SelectedRowItem.Sno) {
        this.ItemData[this.findIndexById(this.SelectedRowItem.Sno)] = this.SelectedRowItem;
        // this.SelectedRowItem.Price = this.SelectedRowItem.Price * Qty
        this.SelectedRowItem.Amount = this.SelectedRowItem.Price * Qty
      }
      else {
        this.SelectedRowItem.Sno = this.createId();
        this.SelectedRowItem.Amount = this.SelectedRowItem.Price * Qty
        // this.SelectedRowItem.image = 'product-placeholder.svg';
        this.ItemData.push(this.SelectedRowItem);
      }

      this.ItemData = [...this.ItemData];
      this.productDialog = false;
      var totCost = this.Total + this.SelectedRowItem.Amount;

      this.onItemCal(totCost);
      this.Description = "";
      this.Desc = this.SelectedRowItem.Description + ' @ ' + this.SelectedRowItem.Price;
      this.SelectedRowItem = {};
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.ItemData.length; i++) {
      if (this.ItemData[i].Sno === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }


  deleteSearchProducts() { }



  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log("ngOnChanges", changes);
  //   for (const propName in changes) {
  //     let change = changes[propName];
  //     if (propName == 'coi') {
  //       // console.log('CHANGED...DO HERE');
  //       console.log(this.scrollDiv.nativeElement.offsetHeight);
  //       console.log(this.scrollDiv.nativeElement.scrollHeight);
  //     }

  //   }
  // let scanner = new UsbScanner({
  //   vendorId: 1155,
  //   productId: 22352
  //   //   /** You could also initialize the scanner by giving entering the path variable:
  //   //    *  path: 'IOService:/AppleACPI etc...'
  //   //   **/
  // });

  //   //scanner emits a data event once a barcode has been read and parsed
  //   scanner.on("data", function (code) {
  //     console.log("recieved code : " + code);
  //     let letCode = document.getElementById("codeInput").focus();
  //     this.ItemData.push(letCode);
  //   });

  // }

  onLogin() {
    if (this.UserName !== undefined && this.Password !== undefined && this.UserName !== null && this.Password !== null) {
      const params = {
        ID: this.UserName,
        Password: this.Password,
        // Email: 'Subashvishal64@gmail.com'
      };
      this.restAPI.post(PathConstants.LOGIN, params).subscribe(res => {
        if (res.type === 'success!') {
          this.LoginUser = res.value
          this.enableLogin = false;
          this.enableHome = true;
          this.onPlanetTime = new Date();
          this.clock = this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss');
          this.scrollToBottom();
          this.onMenuGet();
          this.onSideMenu();
          // this.onItem();
          this.onVendor();
          this.MenuColor = ['green', '#58FA58', '#9A2EFE', '#FF8000', '#FF0040', '#81DAF5', 'green', '#58FA58', '#9A2EFE', '#FF8000',
            '#2E2E2E', '#81DAF5', 'green', '#58FA58', '#9A2EFE', '#3B0B17', '#2E2E2E', '#81DAF5', 'green', '#58FA58', '#FF0040', '#3B0B17',
            '#2E2E2E', '#81DAF5'];
          this.doubleCost1 = [5.00, 10.00, 15.00, 20.00, 25.00];
          this.doubleCost2 = [30.00, 35.00, 40.00, 45.00, 50.00];
          this.singleCost1 = ['1', '2', '3', '4', '5'];
          this.singleCost2 = ['6', '7', '8', '9', '0'];
          this.ItemColumn = this.tableconstant.ItemDescriptionColumn;
          this.ItemData.id;
          this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
          ];

          this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
          ];
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.message });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400 || err.status === 401) {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.error.message });
          // this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: "Invalid UserName!" });
        }
      });
    }
  }

  onClearLogin() {
    if (this.UserName !== undefined && this.Password !== undefined && this.UserName !== null && this.Password !== null) {
      const params = {
        ID: this.UserName,
        Password: this.Password,
        // Email: 'Subashvishal64@gmail.com'
      };
      this.restAPI.post(PathConstants.LOGIN, params).subscribe(res => {
        if (res.type === 'success!') {
          this.LoginUser = res.value
          this.Description = "";
          this.Desc = "";
          this.ItemSno = 1;
          this.ItemData = [];
          this.Total = this.TotalDiscount = this.Paid = this.ChangeAmount = this.NearTotal = this.NextNear = this.LastTotal = 0;
          this.enableClearPermission = false;
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: 'Sales Cleared', detail: 'Start Your New Sales' });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400 || err.status === 401) {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.error.message });
          // this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: "Invalid UserName!" });
        }
      });
    }
  }

  onRegister() {
    if (this.User !== undefined && this.User !== null && this.Pass !== undefined && this.Pass !== null && this.CPassword !== undefined && this.CPassword !== null && this.Pass === this.CPassword) {
      const params = {
        ID: this.UserID,
        Username: this.User,
        Password: this.Pass,
        Email: this.Email || 'Subashvishal64@gmail.com'
      };
      this.restAPI.post(PathConstants.REGISTER, params).subscribe(res => {
        if (res.type === 'success!') {
          this.UserName = res.value;
          this.enableLogin = false;
          this.enableSignUp = false;
          this.enableHome = true;
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_SUCCESS, detail: res.message });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400 || err.status === 401) {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: err.error.message });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 'Auth-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: "Please Contact Administrator" });
        }
      });
    }
  }

  submit(user) {
    console.log(this.UserName);
  }

  onSignUp() {
    this.enableSignUp = true;
    this.enableLogin = false;
  }

  // Table
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }
  isLastPage(): boolean {
    return this.TransListData ? this.first === (this.TransListData.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.TransListData ? this.first === 0 : true;
  }

  //Login Out
  onLogOut() {
    this.UserName = this.Password = "";
    this.enableHome = false;
    this.enableLogin = true;
    this.ItemData = [];
    // this.menuTitle = [];
    // this.menuTempTitle = [];
    this.Desc = "";
    this.Total = this.NearTotal = this.NextNear = this.LastTotal = this.Paid = this.ChangeAmount = 0;
    this.enableMain = true;
    this.enableSide = this.enableCost = this.EnableChangeAmount = false;
    // this.onReload()
    this.SalesMode = 'START';
  }

  onReload() {
    // window.location.reload();
    // remote.BrowserWindow.getFocusedWindow().minimize();
  }

  onfuncButt(func) {
    if (this.enableFunction == true) {
      this.functionButtons = ['LOG OUT', 'TRANS LIST', 'PETTY CASH', 'SUSPENDED', 'PRICE CHECK', 'PRINT LAST'];
      // this.functionButtons = ['LOG OUT','TRANS LIST','PETTY CASH','SUSPENDED','CUSTOMER','BO TRANS LIST','PRICE CHECK','REPORTS','PRINT LAST','SALES','EXTRAS'];
      this.ButtonColor = ['green', '#58FA58', '#9A2EFE', '#FF8000', '#FF0040', '#81DAF5', 'green', '#58FA58', '#9A2EFE', '#FF8000',
        '#2E2E2E', '#81DAF5', 'green', '#58FA58', '#9A2EFE', '#3B0B17', '#2E2E2E', '#81DAF5', 'green', '#58FA58', '#FF0040', '#3B0B17',
        '#2E2E2E', '#81DAF5'];
      if (this.functionButtons === undefined && this.functionButtons === null) {
        let f = 0;
        this.functionButtons.forEach(result => {
          this.functionButtons.push({ Description: result[f], Color: this.ButtonColor[f] });
          // this.functionButtons = ['LOG OUT', Color: '#9A2EFE','TRANS LIST', Color: '#9A2EFE','PETTY CASH', Color: '#9A2EFE','SUSPENDED', Color: '#9A2EFE','CUSTOMER', Color: '#9A2EFE','BO TRANS LIST', Color: '#9A2EFE','PRICE CHECK', Color: '#9A2EFE','REPORTS', Color: '#9A2EFE','PRINT LAST', Color: '#9A2EFE','SALES', Color: '#9A2EFE','EXTRAS'];
          this.enableFunction = true;
        });
      }
    }
  }


  onItem() {
    this.restAPI.get(PathConstants.ITEM).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.AllItem = res.value;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onItemPush(res, Amount) {
    this.ItemData.push({
      // Trans_ID: res.value[0].Trans_No,
      // Line_No: tempItem.length,
      Sno: this.ItemSno++,
      ItemNo: res.value[0].Item_No,
      Number: res.value[0].Item_No,
      Description: res.value[0].Description,
      Quantity: 1,
      Price: res.value[0].Price,
      Amount: Amount,
      Discount: res.value[0].Discount || 0.00,
      Net_Amount: Amount,
      Staff_ID: this.LoginUser,
      Store_ID: 'Subash_Store',
      Till_ID: '1',
      Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
      Department_ID: res.value[0].Department,
      Z_Report_ID: 12345,
      Payment_Type: this.PaymentType,
      Scanned: 1,
      Barcode: '12345',
      Scale: 0,
      Item_Group: res.value[0].Item_Group || '',
      Item_Sub_Group: res.value[0].Item_Sub_Group || '',
      Unit_Cost: res.value[0].Cost,
      Total_Cost: res.value[0].Cost,
      HoursOfDay: 15,
      DayOfYear: 156,
      WeekOfYear: 26,
      MonthOfYear: 5,
      QuarterOfYear: 4,
      YearOfYear: 2021
    });
    var totCost = this.Total + res.value[0].Price;
    var totval = totCost.toFixed(2);
    this.TempTotal = +totval;
    this.Total = this.TempTotal;
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    if (this.NearTotal % 10 === 0) {
      this.NextNear = this.NearTotal + 10;
    } else {
      this.NextNear = this.Total / 10;
      this.NextNear = parseInt(this.NextNear);
      this.NextNear = (this.NextNear * 10 + 10);
    }
    this.LastTotal = this.NextNear + 10;
  }

  onItemCal(totCost) {
    var totval = totCost.toFixed(2);
    this.TempTotal = +totval;
    this.Total = this.TempTotal;
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    if (this.NearTotal % 10 === 0) {
      this.NextNear = this.NearTotal + 10;
    } else {
      this.NextNear = this.Total / 10;
      this.NextNear = parseInt(this.NextNear);
      this.NextNear = (this.NextNear * 10 + 10);
    }
    this.LastTotal = this.NextNear + 10;
  }

  onDescription() {
    let tempItemNo = this.Description;
    // let Itemlength = tempItemNo.length;
    let Amount = 0.00;
    if (this.Description !== undefined && this.Description !== null) {
      const params = {
        ItemNo: this.Description,
        // Type: Itemlength
      }
      this.restAPI.post(PathConstants.ITEM_SEARCH, params).subscribe(res => {
        if (res.value.length != 0) {
          Amount = res.value[0].Price - 0.00 * res.value[0].Price;
          // this.ItemData.push({ 'Sno': this.ItemSno++, 'ItemNo': des.value.Item_No, 'Description': des.value.Description, 'Quantity': 1, 'Price': des.value.Price, 'Discount': 0.00, 'Amount': Amount, 'Scale': des.value.Scale });
          this.onItemPush(res, Amount);
          this.Description = "";
          this.Desc = res.value[0].Description + ' @ ' + res.value[0].Price;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.message });
        }
        else if (res.value.length == 0) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Item Not Found" });
        }
      });
    }
  }

  onEnter() {
    let tempItemNo = this.Description;
    let Amount = 0.00;
    if (this.Description !== undefined && this.Description !== null) {
      const params = {
        ItemNo: this.Description,
      }
      this.restAPI.post(PathConstants.ITEM_SEARCH, params).subscribe(res => {
        if (res.value.length != 0) {
          Amount = res.Price - 0.00 * res.Price;
          // this.ItemData.push({ 'Sno': this.ItemSno++, 'ItemNo': res.ItemNo, 'Description': res.Description, 'Quantity': 1, 'Price': res.Price, 'Discount': 0.00, 'Amount': Amount, 'Scale': res.Scale });
          this.onItemPush(res, Amount);
          this.Description = "";
          this.Desc = res.value[0].Description + ' @ ' + res.value[0].Price;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.message });
        }
        else if (res.value.length == 0) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Item Not Found" });
        }
      });
    }
  }

  onBarcodeDescription($event) {
    let scanner = new UsbScanner({
      // vendorId: 1155,
      // productId: 22352
      //   /** You could also initialize the scanner by giving entering the path variable:
      //    *  path: 'IOService:/AppleACPI etc...'
      //   **/
    });

    //scanner emits a data event once a barcode has been read and parsed
    this.Description = this.Description;
    this.onDescription();
    this.Description = "";
    // this.ItemData.push({ 'Description': this.BarcodeDescription });
    // this.BarcodeDescription = "";
    scanner.on('data', (data) => {
      scanner.on;
      console.log(getDevices());
      this.Description = console.log(data);
      console.log(this.Description = data);
      this.ItemData.push({ 'Description': data });
      this.ItemData = data;
      console.log(data);
    });
    // scanner.on("data", function (code) {
    //   console.log("recieved code : " + code);
    //   let letCode = document.getElementById("codeInput").focus();
    //   this.ItemData.push(letCode);
    // });
  }

  onVendor() {
    if (this.vendorList.length === 0) {
      this.restAPI.get(PathConstants.VENDOR_GET).subscribe(res => {
        if (res.value) {
          this.vendorList = res.value;
          this.vendorColumn = this.tableconstant.VendorListColumn;
          let sno = 0;
          this.vendorList.forEach(s => {
            sno += 1;
            s.SlNo = sno;
          })
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message + ' Not Found' });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
    }
  }

  onMenuGet() {
    this.restAPI.get(PathConstants.MAIN_MENU).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.MainMenu = res.value;
        let j = 0;
        this.MainMenu.forEach(res => {
          // this.menuTitle.push({ 'ID': res.Key_Value, 'Description': res.Description, 'Color': this.MenuColor[j], 'Key_Command': res.Key_Command, 'Key_Value': res.Key_Value, 'Menu_ID': res.Menu_ID });
          this.menuTitle.push({ 'ID': res.RoleID, 'Description': res.Description, 'Color': this.MenuColor[j], 'Colour': res.Colour, 'ImagePath': res.ImagePath, 'Key_Command': res.Key_Command, 'Key_Value': res.Key_Value, 'Key_ID': res.Key_ID, 'Menu_ID': res.Menu_ID });
          j += 1;
        });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onSideMenu() {
    this.restAPI.get(PathConstants.SUB_MENU).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.sideMenu = res.value;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onSideMenuGet(d, position: string) {
    this.menuTempTitle = [];
    this.menuSub = null;
    this.position = position;
    if (this.sideMenu !== undefined && this.sideMenu !== null) {
      let j = 0;
      this.sideMenu.forEach(result => {
        if (d.Key_Command === "0") {
          this.enableCost = true;
          this.CostLabel = d.Description;
          this.menuSub = d;
        } else if (d.Key_Value === result.Menu_ID) {
          if (result.Description !== '' && result.Description !== null && result.Description !== undefined && result.Description !== 'BACK') {
            // this.menuTempTitle.push({
            //   'Menu_ID': result.Menu_ID, 'Description': result.Description,
            //   'Color': this.MenuColor[j], 'Key_Value': result.Key_Value
            // });
            this.menuTempTitle.push({ 'ID': result.RoleID, 'Description': result.Description, 'Color': this.MenuColor[j], 'Colour': result.Colour, 'ImagePath': result.ImagePath, 'Key_Command': result.Key_Command, 'Key_Value': result.Key_Value, 'Key_ID': result.Key_ID, 'Menu_ID': result.Menu_ID });
            j += 1;
          }
          // this.enableMain = false;
          this.enableSide = true;
          this.position = position;
        }
      });
    }
  }

  onSubMenuItem(d) {
    let Amount = 0.00;
    if (d !== undefined && d !== null) {
      const params = {
        ItemNo: d.Key_Value,
        // Type: Itemlength
      }
      this.restAPI.post(PathConstants.ITEM_SEARCH, params).subscribe(res => {
        if (res.value.length != 0) {
          this.SalesMode = 'SALES';
          Amount = res.value[0].Price - 0.00 * res.value[0].Price;
          // this.AllItem.forEach(res => {
          //   if (res.Item_No === d.Key_Value) {
          // Amount = res.Price - 0.00 * res.Price;
          // this.ItemData.push({ 'Sno': this.ItemSno++, 'ItemNo': res.ItemNo, 'Description': res.Description, 'Quantity': 1, 'Price': res.Price, 'Discount': 0.00, 'Amount': Amount, 'Scale': res.Scale });
          this.onItemPush(res, Amount);
          this.enableSide = false;
          this.Desc = res.value[0].Description + ' @ ' + res.value[0].Price;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.message });
        }
        else if (res.value.length == 0) {
          this.messageService.clear();
          this.messageService.add({ key: 'i-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Item Not Found" });
        }
      });
    }
  }

  //buttons

  //Trans List

  onTransGet() {
    this.restAPI.get(PathConstants.TRANS_ID_GET).subscribe(res => {
      this.TransListData = res.value;
      this.enableTrans = true;
      let sno = 0;
      this.TransListData.forEach(s => {
        s.SlNo += sno;
        sno += 1;
      });
    })
  }

  onTrans() {
    this.loading = true;
    this.restAPI.get(PathConstants.SALES_GET).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.TransListData = res.value;
        let sno = 0;
        this.TransListData.forEach(res => {
          sno += 1;
          res.SlNo = sno;
          res.Sales_Amount = "£" + res.Sales_Amount;
        });
        this.loading = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onTransList() {
    this.SubTransColumn = this.TransSubListData = [];
    this.TransColumn = this.tableconstant.TransColumn;
    this.onTrans();
    this.enableTrans = true;
  }


  onRow(event, response) {

  }



  onRowTrans(response) {
    let id: any;
    id = response.Trans_No;
    const params = {
      Trans_No: id
    }
    if (id !== null && id !== undefined) {
      this.restAPI.post(PathConstants.TRANS_ID_GET, params).subscribe(res => {
        if (res.value) {
          this.SubTransColumn = this.tableconstant.TransSubColumn;
          this.TransSubListData = res.value;
          let sno = 0;
          this.TransSubListData.forEach(res => {
            sno += 1;
            res.SlNo = sno;
            res.Sales_Amount = "£ " + res.Sales_Amount;
          });
          this.loading = false;
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: res.message });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
    }
  }

  onRowSubTrans(event, response) { }


  onCalDesc($event) {
    let tempdesc = $event.target.value;
    if (tempdesc === ".00") {
      this.Description = this.Description + '.00';
    } else if (tempdesc === ".0") {
      this.Description += ".0";
    } else if (tempdesc === ".") {
      this.Description += ".";
    } else {
      this.Description = this.Description + tempdesc;
    }
  }

  onBack() {
    this.enableMain = true;
    this.enableSide = false;
  }

  onCost(d, position: string) {
    // let Amount = 0.00;
    let tempCost = d;
    if (d === 5.00 || d === 10.00 || d === 15.00 || d === 20.00 || d === 25.00 || d === 30.00 || d === 35.00 || d === 40.00 || d === 45.00 || d === 50.00) {
      var totCost = this.Total + tempCost;
      this.onItemCal(totCost);
      this.ItemData.push({
        Sno: this.ItemSno++,
        ItemNo: this.menuSub.ID,
        Number: this.menuSub.Key_Value,
        Description: this.menuSub.Description,
        Quantity: 1,
        Price: tempCost,
        Amount: tempCost,
        Discount: 0.00,
        Net_Amount: tempCost,
        Staff_ID: this.LoginUser,
        Store_ID: 'Subash_Store',
        Till_ID: '1',
        Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
        Department_ID: this.menuSub.Description,
        Z_Report_ID: 12345,
        Payment_Type: this.PaymentType,
        Scanned: 1,
        Barcode: '12345',
        Scale: 0,
        Item_Group: '',
        Item_Sub_Group: '',
        Unit_Cost: 0.00,
        Total_Cost: 0.00,
        HoursOfDay: 15,
        DayOfYear: 156,
        WeekOfYear: 26,
        MonthOfYear: 5,
        QuarterOfYear: 4,
        YearOfYear: 2021
      });
    } else {
      this.onEnterCost();
    }
    this.enableCost = false;
    this.position = position;
  }

  onEnterCost() {
    if (this.Cost != 0 && this.Cost !== undefined && this.Cost !== null) {
      var totCost = this.Total + this.Cost;
      this.onItemCal(totCost);
      this.ItemData.push({
        Sno: this.ItemSno++,
        ItemNo: this.menuSub.ID,
        Number: this.menuSub.Key_Value,
        Description: this.menuSub.Description,
        Quantity: 1,
        Price: this.Cost,
        Amount: this.Cost,
        Discount: 0.00,
        Net_Amount: this.Cost,
        Staff_ID: this.LoginUser,
        Store_ID: 'Subash_Store',
        Till_ID: '1',
        Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
        Department_ID: this.menuSub.Description,
        Z_Report_ID: 12345,
        Payment_Type: this.PaymentType,
        Scanned: 1,
        Barcode: '12345',
        Scale: 0,
        Item_Group: '',
        Item_Sub_Group: '',
        Unit_Cost: 0.00,
        Total_Cost: 0.00,
        HoursOfDay: 15,
        DayOfYear: 156,
        WeekOfYear: 26,
        MonthOfYear: 5,
        QuarterOfYear: 4,
        YearOfYear: 2021
      });
    }
    this.enableCost = false;
    this.Cost = 0;
  }

  onCancel() {
    this.Cost = "";
    this.enableCost = false;
  }

  onClearCost() {
    this.Cost = "";
  }

  onExactAmount() {
    let exactAmount = this.Total;
    this.Paid = exactAmount;
    this.ChangeAmount = 0;
    this.onSave();
  }

  onNearAmount() {
    let nearTotal = 0;
    this.Paid = this.NearTotal;
    nearTotal = Math.abs(this.Paid - this.Total);
    this.ChangeAmount = nearTotal.toFixed(2);
    // this.EnableChangeAmount = true;
    this.onSave();
  }

  onNearAmount2() {
    let nearTotal = 0;
    this.Paid = this.LastTotal;
    nearTotal = this.Paid - this.Total;
    this.ChangeAmount = nearTotal.toFixed(2);
    // this.EnableChangeAmount = true;
    this.onSave();
  }

  onNearAmount1() {
    let nearTotal = 0;
    this.Paid = this.NextNear;
    nearTotal = Math.abs(this.Paid - this.Total);
    this.ChangeAmount = nearTotal.toFixed(2);
    // this.EnableChangeAmount = true;
    this.onSave();
  }

  onCash() {
    let nearTotal = 0;
    let tempItemNo = this.Description;
    this.Description = tempItemNo;
    // this.Total = this.Description;
    this.Paid = this.Description;
    nearTotal = Math.abs(this.Paid - this.Total);
    this.ChangeAmount = nearTotal.toFixed(2);
    // this.EnableChangeAmount = true;
    if (this.PaymentType == 'CASH') {
      this.onSave();
    }
  }

  onCard() {
    this.PaymentType = 'CARD';
    this.Paid = this.Total;
    let nearTotal = 0;
    nearTotal = Math.abs(this.Paid - this.Total);
    this.ChangeAmount = nearTotal.toFixed(2);
    // this.EnableChangeAmount = true;
    if (this.PaymentType == 'CARD') {
      this.onSave();
    }
    this.PaymentType = 'CASH';
  }

  onClear() {
    this.Description = "";
    this.Desc = "";
    this.ItemSno = 1;
    this.ItemData = [];
    this.Total = this.TotalDiscontAmount = this.Paid = this.ChangeAmount = this.NearTotal = this.NextNear = this.LastTotal = 0;
    this.SalesMode = 'START';
  }

  onClearPermission() {
    this.UserName = this.Password = "";
    this.enableClearPermission = true;
    this.SalesMode = 'START';
  }

  onClearDesc() {
    this.Description = "";
  }

  onClose(s) {
    this.messageService.clear('t-err');
    this.ChangeAmount = 0;
  }

  onAuthClose() {
    this.messageService.clear('Auth-err');
    this.ChangeAmount = 0;
  }

  onSubItemClose() {
    this.messageService.clear('i-err');
    this.ChangeAmount = 0;
  }



  ///On Add Items
  onAddProduct(res) {
    let Amount = 0.00;
    Amount = res.Price - 0.00 * res.Price;
    this.ItemData.push({
      Sno: this.ItemSno++,
      ItemNo: res.Item_No,
      Number: res.Item_No,
      Description: res.Description,
      Quantity: 1,
      Price: res.Price,
      Amount: Amount,
      Discount: res.Discount || 0.00,
      Net_Amount: res.Amount,
      Staff_ID: this.LoginUser,
      Store_ID: 'Subash_Store',
      Till_ID: '1',
      Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
      Department_ID: res.Department,
      Z_Report_ID: 12345,
      Payment_Type: this.PaymentType,
      Scanned: 1,
      Barcode: '12345',
      Scale: 0,
      Item_Group: res.Item_Group,
      Item_Sub_Group: res.Item_Sub_Group,
      Unit_Cost: res.Cost,
      Total_Cost: res.Cost,
      HoursOfDay: 15,
      DayOfYear: 156,
      WeekOfYear: 26,
      MonthOfYear: 5,
      QuarterOfYear: 4,
      YearOfYear: 2021
    });
    var totCost = this.Total + res.Price;
    this.Desc = res.Description + ' @ ' + res.Price;
    var totval = totCost.toFixed(2);
    this.TempTotal = +totval;
    this.Total = this.TempTotal;
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    if (this.NearTotal % 10 === 0) {
      this.NextNear = this.NearTotal + 10;
    } else {
      this.NextNear = this.Total / 10;
      this.NextNear = parseInt(this.NextNear);
      this.NextNear = (this.NextNear * 10 + 10);
    }
    this.LastTotal = this.NextNear + 10;
  }








  //Functions

  LinePriceDiscount() {
    this.LineDiscontAmount = '';
    this.enablePriceCheck = true;
    this.PriceDescData = [];
    this.PriceDes = "";
    this.PriceDescription = '';
  }

  PriceCheck() {
    this.enablePriceCheck = true;
    this.PriceDescData = [];
    this.PriceDes = "";
    this.PriceDescription = '';
  }

  PriceCheckDes() {
    let Amount = 0;
    if (this.PriceDescription !== undefined && this.PriceDescription !== null) {
      const params = {
        ItemNo: this.PriceDescription,
      }
      this.restAPI.post(PathConstants.ITEM_SEARCH, params).subscribe(res => {
        if (res.value.length != 0) {
          Amount = res.value[0].Price - 0.00 * res.value[0].Price;
          this.PriceDes = "Price for " + res.value[0].Description + " is " + res.value[0].Price + " (Quantity - 1)";
          this.PriceDescData.push({
            Sno: this.ItemSno++,
            ItemNo: res.value[0].Item_No,
            Number: res.value[0].Item_No,
            Description: res.value[0].Description,
            Quantity: 1,
            Price: res.value[0].Price,
            Amount: Amount,
            Discount: res.value[0].Discount || 0.00,
            Net_Amount: Amount,
            Staff_ID: this.LoginUser,
            Store_ID: 'Subash_Store',
            Till_ID: '1',
            Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
            Department_ID: res.value[0].Department,
            Z_Report_ID: 12345,
            Payment_Type: this.PaymentType,
            Scanned: 1,
            Barcode: '12345',
            Scale: 0,
            Item_Group: res.value[0].Item_Group || '',
            Item_Sub_Group: res.value[0].Item_Sub_Group || '',
            Unit_Cost: res.value[0].Cost,
            Total_Cost: res.value[0].Cost,
            HoursOfDay: 15,
            DayOfYear: 156,
            WeekOfYear: 26,
            MonthOfYear: 5,
            QuarterOfYear: 4,
            YearOfYear: 2021
          });
          this.enablePriceAdd = true;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: "Item Found" });
        }
        else if (res.value.length == 0) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Item Not Found" });
          this.PriceDescription = "";
          this.PriceDes = "";
          this.enablePriceAdd = false;
        }
      });
    }
  }

  onCheck() {
    this.ItemData.push(this.PriceDescData[0]);
    var totCost = this.Total + this.PriceDescData[0].Price;
    var totval = totCost.toFixed(2);
    this.TempTotal = +totval;
    this.Total = this.TempTotal;
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    this.NextNear = 20;
    this.LastTotal = 50;
    this.Desc = this.PriceDescData[0].Description + ' @ ' + this.PriceDescData[0].Price;
    this.PriceDes = "";
    this.enablePriceCheck = false;
    this.PriceDescData = [];
    this.enablePriceAdd = false;
  }


  onPity() {
    this.enablePetty = true;
    let draw = this.Description;
    let whom = this.flewReason;
    this.DrawerCash = this.DrawerCash - draw;
    this.Desc = "Cash Gifted to {{whom}}![icon]";
    // this.Total = draw;
  }

  onPetty() {
    this.enablePetty = true;
    this.enablePettyHead = false;
  }



  //Petty Cash

  onReduceCash(res, LocalDesc, Item_No) {
    let Amount = (Math.round(this.PetCash * 100) / 100).toFixed(2);
    this.ItemData.push({
      Sno: this.ItemSno++,
      ItemNo: Item_No,
      Number: Item_No,
      Description: LocalDesc,
      Quantity: -1,
      Price: -this.PetCash,
      Amount: -Amount,
      Discount: res.Discount || 0.00,
      Net_Amount: -Amount,
      Staff_ID: this.LoginUser,
      Store_ID: 'Subash_Store',
      Till_ID: '1',
      Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
      Department_ID: LocalDesc,
      Z_Report_ID: 12345,
      Payment_Type: this.PaymentType,
      Scanned: 1,
      Barcode: '12345',
      Scale: 0,
      Unit_Cost: 0.00,
      Total_Cost: 0.00,
      HoursOfDay: 15,
      DayOfYear: 156,
      WeekOfYear: 26,
      MonthOfYear: 5,
      QuarterOfYear: 4,
      YearOfYear: 2021,
      Item_Group: "",
      Item_Sub_Group: ""
    });
    var totCost = this.Total - this.PetCash;
    this.Desc = LocalDesc + ' @ ' + this.PetCash;
    var totval = totCost.toFixed(2);
    this.TempTotal = +totval;
    this.Total = this.TempTotal;
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    if (this.NearTotal % 10 === 0) {
      this.NextNear = this.NearTotal + 10;
    } else {
      this.NextNear = this.Total / 10;
      this.NextNear = parseInt(this.NextNear);
      this.NextNear = (this.NextNear * 10 + 10);
    }
    this.LastTotal = this.NextNear + 10;
    this.PetCash = null;
  }


  onAddCash(res, LocalDesc, Item_No) {
    let Amount = 0.00;
    Amount = this.PetCash - 0.00 * this.PetCash;
    this.ItemData.push({
      Sno: this.ItemSno++,
      ItemNo: Item_No,
      Number: Item_No,
      Description: LocalDesc,
      Quantity: 1,
      Price: this.PetCash,
      Amount: Amount,
      Discount: res.Discount || 0.00,
      Net_Amount: Amount,
      Staff_ID: this.LoginUser,
      Store_ID: 'Subash_Store',
      Till_ID: '1',
      Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
      Department_ID: LocalDesc,
      Z_Report_ID: 12345,
      Payment_Type: this.PaymentType,
      Scanned: 1,
      Barcode: '12345',
      Scale: 0,
      Item_Group: '',
      Item_Sub_Group: '',
      Unit_Cost: 0.00,
      Total_Cost: 0.00,
      HoursOfDay: 15,
      DayOfYear: 156,
      WeekOfYear: 26,
      MonthOfYear: 5,
      QuarterOfYear: 4,
      YearOfYear: 2021
    });
    var totCost = this.Total + this.PetCash;
    this.Desc = LocalDesc + ' @ ' + this.PetCash;
    var totval = totCost.toFixed(2);
    this.TempTotal = +totval;
    this.Total = this.TempTotal;
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    if (this.NearTotal % 10 === 0) {
      this.NextNear = this.NearTotal + 10;
    } else {
      this.NextNear = this.Total / 10;
      this.NextNear = parseInt(this.NextNear);
      this.NextNear = (this.NextNear * 10 + 10);
    }
    this.LastTotal = this.NextNear + 10;
    this.PetCash = null;
  }


  CashLess() {
    let res = [];
    let Item_No = 11
    let LocalDesc = "Cash Less";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  FromLottery() {
    let res = [];
    let Item_No = 12
    let LocalDesc = "From Lottery";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  VendorLess() {
    this.onVendor();
    this.enableVendor = true;
  }

  onRowVendor(event, response) {
    let id: any;
    id = response.Vendor_No;
    let res = [];
    let Item_No = 13
    let LocalDesc = id;
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
    this.enableVendor = false;
  }

  OtherOut() {
    let res = [];
    let Item_No = 14
    let LocalDesc = "Other Out";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  FromBank() {
    let res = [];
    let Item_No = 15
    let LocalDesc = "For Bank";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  EmployeeWages() {
    let res = [];
    let Item_No = 16
    let LocalDesc = "Employee Wages";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  PayPoint() {
    let res = [];
    let Item_No = 17
    let LocalDesc = "Pay Point";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  AccPay() {
    let res = [];
    let Item_No = 18
    let LocalDesc = "Account Pay";
    res = this.ItemData;
    this.onAddCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  PayInstance() {
    let res = [];
    let Item_No = 19
    let LocalDesc = "Instance Pay";
    res = this.ItemData;
    this.onReduceCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }

  CashReturn() {
    let res = [];
    let Item_No = 20
    let LocalDesc = "Cash Return";
    res = this.ItemData;
    this.onAddCash(res, LocalDesc, Item_No);
    this.enablePetty = false;
  }




  onBackPetty() {
    this.enablePetty = false;
    this.enablePettyHead = true;
    // this.enableSide = false;
  }


  onSuspened() {
    let suspend = this.ItemData;
    this.suspended = suspend;
    this.suspendTotal = this.Total;
    this.suspendNearTotal = this.NearTotal;
    this.suspendNextNear = this.NextNear;
    this.suspendLast = this.LastTotal;
    this.onClear();
    this.messageService.clear();
    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: "Transaction Suspended" });
  }

  onSusupenseClick() {
    this.ItemData = [];
    this.ItemData = this.suspended;
    this.Total = this.suspendTotal;
    this.NearTotal = this.suspendNearTotal;
    this.NextNear = this.suspendNextNear;
    this.LastTotal = this.suspendLast;
    this.suspense = true;
  }



  // Sales Mode

  onSalesMode() {
    this.enableSales = true;
    this.enableSalesHead = false;
  }

  ClearSelectedItem() {

  }



  // Discount

  onDiscCal(totCost, disc) {
    var totval = totCost.toFixed(2);
    var totdis = disc.toFixed(2);
    this.TempTotal = +totval;
    this.TempDisc = +totdis;
    this.Total = this.TempTotal;
    this.TotalDiscount = (this.TotalDiscount - this.TempDisc);
    this.NearTotal = Math.round(this.Total);
    this.NearTotal = parseInt(this.Total + 1);
    if (this.NearTotal % 10 === 0) {
      this.NextNear = this.NearTotal + 10;
    } else {
      this.NextNear = this.Total / 10;
      this.NextNear = parseInt(this.NextNear);
      this.NextNear = (this.NextNear * 10 + 10);
    }
    this.LastTotal = this.NextNear + 10;
  }

  onDiscountAmount() {
    if (this.LineDiscontAmount <= this.SelectedRowItem.Amount) {
      // if (this.LineDiscontAmount <= this.SelectedRowItem.Amount) {
      this.SelectedRowItem.Discount = this.LineDiscontAmount;
      let Amount = (this.SelectedRowItem.Price - this.SelectedRowItem.Discount) * this.SelectedRowItem.Quantity;
      this.SelectedRowItem.Amount = Amount;
      var disc = this.SelectedRowItem.Price - Amount;
      // Amount = res.value[0].Price - 0.00 * res.value[0].Price;
      this.Total = this.Total - this.LineDiscontAmount;
      var totCost = this.Total;
      this.Desc = 'Line Amount Discount' + ' @ ' + this.LineDiscontAmount;
      this.onDiscCal(totCost, disc);
      this.enableLineDiscount = false;
      this.LineDiscontAmount = 0;
    } else {
      this.LineDiscontAmount = 0;
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Please enter valid amount" });
    }
  }

  onDiscountPercentage() {
    let disc = this.LineDiscontAmount;
    let Amount = (this.SelectedRowItem.Price - ((this.LineDiscontAmount * this.SelectedRowItem.Price) / 100)) * this.SelectedRowItem.Quantity;
    Amount = Amount - 0.00 * Amount;
    this.SelectedRowItem.Amount = Amount;
    disc = this.SelectedRowItem.Price - Amount;
    this.SelectedRowItem.Discount = disc;
    this.Total = this.Total - disc;
    var totCost = this.Total;
    this.Desc = 'Line Percentage Discount' + ' @ ' + this.LineDiscontAmount + ' %';
    this.onDiscCal(totCost, disc);
    this.enableLineDiscount = false;
    this.LineDiscontAmount = 0;
  }


  onCentDiscount() {
    if (this.SelectedRowItem.length != 0) {
      // let disc = this.LineDiscontAmount;
      let linedisc = 100.00;
      let Amount = (this.SelectedRowItem.Price - ((linedisc * this.SelectedRowItem.Price) / 100)) * this.SelectedRowItem.Quantity;
      Amount = Amount - 0.00 * Amount;
      this.SelectedRowItem.Amount = Amount;
      var disc = this.SelectedRowItem.Price - Amount;
      this.SelectedRowItem.Discount = disc;
      this.Total = this.Total - disc;
      var totCost = this.Total;
      this.Desc = this.SelectedRowItem.Description + ' @  100 %';
      this.onDiscCal(totCost, disc);

    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Please select a Item Row for 100 % Discount" });
    }
  }


  onCentDiscountPercentage() {
    // Amount * (1 - (% 100) )
  }


  onDiscountTotalAmount() {
    if (this.TotalDiscontAmount <= this.Total) {
      // this.SelectedRowItem.Discount = this.TotalDiscontAmount;
      // let Amount = (this.SelectedRowItem.Price - this.SelectedRowItem.Discount) * this.SelectedRowItem.Quantity;
      this.Total = this.Total - this.TotalDiscontAmount;
      this.TotalDiscount = this.TotalDiscount + this.TotalDiscontAmount;
      // this.SelectedRowItem.Amount = Amount;
      this.ItemData.push({
        Sno: this.ItemSno++,
        ItemNo: "40",
        Number: "40",
        Description: 'Total Amount Discount',
        Quantity: 0,
        Price: -this.TotalDiscontAmount,
        Amount: -this.TotalDiscontAmount,
        Discount: this.TotalDiscontAmount,
        Net_Amount: -this.TotalDiscontAmount,
        Staff_ID: this.LoginUser,
        Store_ID: 'Subash_Store',
        Till_ID: '1',
        Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
        Department_ID: 'Total Amount Discount',
        Z_Report_ID: 12345,
        Payment_Type: this.PaymentType,
        Scanned: 1,
        Barcode: '12345',
        Scale: 0,
        Item_Group: '',
        Item_Sub_Group: '',
        Unit_Cost: 0.00,
        Total_Cost: 0.00,
        HoursOfDay: 15,
        DayOfYear: 156,
        WeekOfYear: 26,
        MonthOfYear: 5,
        QuarterOfYear: 4,
        YearOfYear: 2021
      });
      var totCost = this.Total;
      this.Desc = 'Total Amount Discount' + ' @ ' + this.TotalDiscontAmount;
      this.onItemCal(totCost);
      this.TotalDiscontAmount = null;
      this.enableTotalDiscount = false;
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Discount Amount exceeding the actual amount" });
    }
  }

  onDiscountTotalPercentage() {
    this.Total = this.Total - ((this.TotalDiscontAmount * this.Total) / 100);
    let discamt = (this.TotalDiscontAmount / 100);
    this.TotalDiscount = this.TotalDiscount + this.Total;
    this.ItemData.push({
      Sno: this.ItemSno++,
      ItemNo: "40",
      Number: "40",
      Description: 'Total Percentage Discount',
      Quantity: 0,
      Price: -discamt,
      Amount: -discamt,
      Discount: discamt,
      Net_Amount: -discamt,
      Staff_ID: this.LoginUser,
      Store_ID: 'Subash_Store',
      Till_ID: '1',
      Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
      Department_ID: 'Total Percentage Discount',
      Z_Report_ID: 12345,
      Payment_Type: this.PaymentType,
      Scanned: 1,
      Barcode: '12345',
      Scale: 0,
      Item_Group: '',
      Item_Sub_Group: '',
      Unit_Cost: 0.00,
      Total_Cost: 0.00,
      HoursOfDay: 15,
      DayOfYear: 156,
      WeekOfYear: 26,
      MonthOfYear: 5,
      QuarterOfYear: 4,
      YearOfYear: 2021
    });
    var totCost = this.Total;
    this.Desc = 'Total Percentage Discount' + ' @ ' + this.TotalDiscontAmount;
    this.onItemCal(totCost);
    this.TotalDiscontAmount = null;
    this.enableTotalDiscount = false;
  }


  LineDisc() {
    if (this.SelectedRowItem.length != 0) {
      this.enableLineDiscount = true;
      // this.LineDiscontAmount = 0;
      this.LineDiscontAmount = this.SelectedRowItem.Discount;
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Please select a Item Row for Discount" });
    }
  }


  TotalDisc() {
    if (this.SelectedRowItem !== undefined && this.SelectedRowItem !== null) {
      this.enableTotalDiscount = true;
      // this.TotalDiscontAmount = this.SelectedRowItem.Discount;
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Total Discount Added" });
    }
  }

  CentDisc() {
    // if (this.ItemData !== undefined && this.ItemData !== null) {
    if (this.SelectedRowItem.length != 0) {
      this.enableCentDiscount = true;
      this.CentDiscontAmount = 100;
    } else {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: "Please select a Item Row for 100 % Discount" });
    }
  }

  onTotalStoreDiscount() {

  }


  PayInstanceSales() {
    this.SaleLabel = "";
    this.enableSalesHead = true;
    let LocalDesc = "Instance Pay";
    this.SaleLabel = LocalDesc;
  }

  AddPayInstanceSales() {
    let res = [];
    let Item_No = 19;
    res = this.ItemData;
    let LocalDesc;
    if (this.SaleLabel === "Instance Pay") {
      LocalDesc = "Instance Pay";
      this.SaleLabel = LocalDesc;
      this.onReduceCash(res, LocalDesc, Item_No);
    } else if (this.SaleLabel === "From Lottery") {
      LocalDesc = "From Lottery";
      this.SaleLabel = LocalDesc;
      this.onReduceCash(res, LocalDesc, Item_No);
    } else if (this.SaleLabel === "Account Pay") {
      LocalDesc = "Account Pay";
      this.SaleLabel = LocalDesc;
      this.onAddCash(res, LocalDesc, Item_No);
    }
    this.enableSalesHead = false;
  }

  FromLotterySales() {
    this.SaleLabel = "";
    this.enableSalesHead = true;
    let LocalDesc = "From Lottery";
    this.SaleLabel = LocalDesc;
  }


  AccPaySales() {
    this.SaleLabel = "";
    this.enableSalesHead = true;
    let LocalDesc = "Account Pay";
    this.SaleLabel = LocalDesc;
  }



  // POST

  onSave() {
    if (this.Total !== 0) {
      let tempItem = this.ItemData;
      this.T_No = Math.floor(100000 + Math.random() * 900000);
      const params1 = {
        // 'Trans_ID': '',
        Trans_No: this.T_No,
        // Trans_No: Math.floor(Math.random() * Date.now()),
        Staff_ID: this.LoginUser,
        Store_ID: 'Subash_Store',
        Till_ID: '101',
        // Trans_Slip: 'CASH',
        TransType: this.PaymentType,
        // Trans_Type: this.ChangeAmount,
        Sales_Amount: this.Total,
        Sales_Type: '£',
        Cust_ID: 1,
        Z_Report_ID: '12345',
        Change: this.ChangeAmount,
        TotalDisc: this.TotalDiscount,
        AmountGiven: this.Paid,
        // Trans_Time: this.onPlanetTime
        // Trans_Time: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
      };
      // let Trans_No = this.T_No;
      this.restAPI.post(PathConstants.SALES_POST, params1).subscribe(res => {
        if (res.value) {
          // console.log(PostedSales);
          // Trans_No: Math.floor(100000 + Math.random() * 900000),
          res = [];
          const PostedSales: any = [];
          this.ItemData.forEach(res => {
            PostedSales.push({
              Trans_ID: Math.floor(100000 + Math.random() * 900000),
              Trans_No: this.T_No,
              Line_No: res.Sno,
              Line_Status: 1,
              Number: res.ItemNo,
              Description: res.Description,
              Quantity: res.Quantity,
              Price: res.Price,
              Amount: res.Amount,
              Disc_Amount: res.Discount || 0.00,
              Net_Amount: res.Amount,
              Staff_ID: this.LoginUser,
              Store_ID: 'Subash_Store',
              Till_ID: '1',
              // Trans_Date: this.onPlanetTime,
              // Trans_Date: this.datepipe.transform(this.onPlanetTime, 'dd/MM/YYYY ' + ' HH:mm:ss'),
              Department_ID: res.Department_ID,
              Z_Report_ID: 12345,
              Trans_Type: this.PaymentType,
              // Payment_Type: this.PaymentType,
              Scanned: 1,
              Barcode: '12345',
              Scale: 0,
              Item_Group: res.Item_Group,
              Item_Sub_Group: res.Item_Sub_Group,
              Unit_Cost: 0.00,
              Total_Cost: 0.00,
              HourOfDay: 15,
              DayOfYear: 156,
              WeekOfYear: 26,
              MonthOfYear: 5,
              QuarterOfYear: 4,
              YearOfYear: 2021
            });
          });
          this.PostedSales = PostedSales;
          if (this.PostedSales !== undefined && this.PostedSales !== null) {
            const params2 = {
              PostedSales: this.PostedSales
            }
            this.restAPI.post(PathConstants.POSTED_SALES_POST, params2).subscribe(SalesResult => {
              if (SalesResult.type == 1) {
                this.confirmationService.confirm({
                  message: 'Is the Change of    £ - ' + this.ChangeAmount + ' Given?',
                  header: 'Post Transaction',
                  icon: 'pi pi-exclamation-triangle',
                  accept: () => {
                    this.T_No = '';
                    this.PostedSales = [];
                    this.onClear();
                    this.ItemData = [];
                    this.messageService.clear();
                    this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: SalesResult.message, life: 3000 });
                    // this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: "Posted Tranaction" });
                  }
                });
                // this.T_No = '';
                // this.PostedSales = [];
                // this.onClear();
                // this.ItemData = [];
                // this.messageService.clear();
                // this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: SalesResult.message, life: 3000 });
                // this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: "Posted Tranaction" });
              } else {
                this.messageService.clear();
                this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ErrorMessage, life: 3000 });
              }
            }, (err: HttpErrorResponse) => {
              if (err.status === 0 || err.status === 400) {
                this.messageService.clear();
                this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage, life: 3000 });
              }
            });
          }
        } else if (res.type == "error") {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: "Data Corrupted!", detail: "Please add the item again", life: 3000 });
        }
      });
    }
  }

  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
  }
}
