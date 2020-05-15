import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/internal/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'Air Purifier';
  public subTitle = 'HS-laba healthy house ';
  public airPurifierState: AirPurifierState;
  public lightModesList: LightMode[] = [
    {id: 0, name: 'None'},
    {id: 1, name: 'Rainbow'},
    {id: 2, name: 'Strip blue'},
    {id: 3, name: 'Strip green'},
    {id: 4, name: 'Strip red'},
    {id: 5, name: 'Pulse blue'},
    {id: 6, name: 'Pulse green'},
    {id: 7, name: 'Pulse red'},
    {id: 8, name: 'Spectrum'},
    {id: 9, name: 'Auto'},
  ];
  public modeListOpen = false;
  public spinner: boolean = false;
  public screen: number = 1;

  private type = 'LineChart';
  data = [
    ['0', {v: 81, f: 18}, {v: 20, f: 18}, {v: 10, f: 18}],
    ['1', {v: 80, f: 16}, {v: 21, f: 18}, {v: 15, f: 18}],
    ['2', {v: 20, f: 19}, {v: 25, f: 18}, {v: 35, f: 18}],
    ['3', {v: 10, f: 21}, {v: 27, f: 18}, {v: 56, f: 18}],
    ['4', {v: 40, f: 25}, {v: 23, f: 18}, {v: 80, f: 18}],
    ['5', {v: 60, f: 23}, {v: 18, f: 18}, {v: 115, f: 18}],
    ['6', {v: 81, f: 16}, {v: 16, f: 18}, {v: 97, f: 18}],
    ['7', {v: 74, f: 11}, {v: 11, f: 18}, {v: 88, f: 18}],
  ];
  private columnNames = ['PM2.5', 't°', 'h(%)', 'PM2.5(ug/m3)'];
  private options = {
    // tooltip: {isHtml: true},
    // bar: {
    //   groupWidth: '95%'
    // },
    // annotations: {
    //   textStyle: {color: 'black', fontSize: 11},
    //   alwaysOutside: true,
    //   stemColor: 'transparent'
    // },
    vAxis: {
      textStyle: {color: '#000000'},
      gridlines: {color: 'transparent', count: 6},
      viewWindow: {min: 0, max: 150}
    },
    animation: {
      duration: 1000,
      easing: 'out',
    },
    title: 'real-time charts',
    curveType: 'function',
    legend: { position: 'bottom' }
  };


  @ViewChild('dataContainer') dataContainer: ElementRef;


  constructor(private http: HttpClient) {
    this.airPurifierState = new AirPurifierState();
  }

  ngOnInit() {
    this.getAirData(undefined, undefined);
    setInterval(this.refreshData, 20000);
  }

  private refreshData() {
    let dataContainerRef = document.getElementById('dataContainer');
    if (dataContainerRef) dataContainerRef.click();
  }

  private getAirData(mode: number, speed: number) {
    const request = 'http://192.168.1.104/fanSettings'
      + (mode?'?mode=' + mode : '')
      + (speed !== undefined ?'&&speed=' + speed : '');
    console.log(request);
    this.spinner = true;
    this.http.get(request).pipe(take(1)).subscribe((data: AirPurifierState) => {
      this.spinner = false;
      if (!isNaN(+data.Humidity)) {
        this.airPurifierState = data;
        this.airPurifierState.Speed = Math.round(+this.airPurifierState.FanPower / 116);
      } else {
      }
    });
  }

  private getColor() {
    if (this.airPurifierState && +this.airPurifierState.LightMode === 9) {
      switch (+this.airPurifierState.Speed) {
        case 0:
          return 'green';
        case 1:
          return 'lightgreen';
        case 2:
          return 'yellowgreen';
        case 3:
          return 'yellow';
        case 4:
          return 'orange';
        case 5:
          return 'orange';
        case 6:
          return 'red';
        case 7:
          return 'red';
        case 8:
          return 'crimson';
        case 9:
          return 'crimson';
      }
    }
  }

  getLightMode() {
    if (this.airPurifierState) {
      switch (+this.airPurifierState.LightMode) {
        case 0: return 'None';
        case 1: return 'Rainbow';
        case 2: return 'Strip blue';
        case 3: return 'Strip green';
        case 4: return 'Strip red';
        case 5: return 'Pulse blue';
        case 6: return 'Pulse green';
        case 7: return 'Pulse red';
        case 8: return 'Spectrum';
        case 9: return 'Auto';
      }
    }
  }

  getLightModeName(modeId: number) {
    if (this.lightModesList.find( e => e.id === +modeId)) {
      return this.lightModesList.find( e => e.id === +modeId).name;
    }
    return '';
  }

  onSelectMode(event) {
    this.airPurifierState.LightMode = event;
    this.modeListOpen = false;
    this.getAirData(this.airPurifierState.LightMode, this.airPurifierState.Speed);
  }

  setSpeed(event) {
    this.airPurifierState.FanPower = event;
    this.airPurifierState.Speed = Math.round(+this.airPurifierState.FanPower / 116);
    this.getAirData(this.airPurifierState.LightMode, this.airPurifierState.Speed);
    console.log()
  }

  changeSpeedEnable() {
    return +this.airPurifierState.LightMode !== 9 && +this.airPurifierState.LightMode !== 0
  }
}

export class AirPurifierState {
  LightMode: number;
  FanPower: number;
  Temperature: number;
  Humidity: number;
  PM25: number;
  Speed: number;
}

export class LightMode {
  id: number;
  name: string;
}
