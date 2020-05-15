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
  public spinner = false;
  public screen = 1;

  private type = 'LineChart';
  data = [];
  protected maxY = 20;
  protected minY = 10;
  private columnNames = ['PM2.5', 't°', 'h(%)', 'PM2.5(ug/m3)'];
  private options = {
    vAxis: {
      textStyle: {color: '#000000'},
      gridlines: {color: 'transparent', count: 6},
      viewWindow: {min: this.minY - 5, max: this.maxY + 5}
    },
    animation: {
      duration: 1000,
      easing: 'out',
    },
    title: 'real-time charts',
    curveType: 'function',
    legend: {position: 'bottom'}
  };


  @ViewChild('dataContainer') dataContainer: ElementRef;

  private measurement = 0;
  protected getData = false;

  constructor(private http: HttpClient) {
    this.airPurifierState = new AirPurifierState();
  }

  ngOnInit() {
    this.getAirData(undefined, undefined);
    setInterval(this.refreshData, 20000);
  }

  private refreshData() {
    const dataContainerRef = document.getElementById('dataContainer');
    if (dataContainerRef) {
      dataContainerRef.click();
    }
  }

  private getAirData(mode: number, speed: number) {
    const request = 'http://192.168.1.104/fanSettings'
      + (mode ? '?mode=' + mode : '')
      + (speed !== undefined ? '&&speed=' + speed : '');
    console.log(request);
    this.spinner = true;

    this.http.get(request).pipe(take(1)).subscribe((data: AirPurifierState) => {
      this.spinner = false;
      if (!isNaN(+data.Humidity)) {
        this.getData = false;
        this.airPurifierState = data;
        this.airPurifierState.Speed = Math.round(+this.airPurifierState.FanPower / 116);
        this.data.push(['' + this.measurement,
          {v: +this.airPurifierState.Temperature},
          {v: +this.airPurifierState.Humidity},
          {v: +this.airPurifierState.PM25}]);
        this.measurement++;
        this.maxY = Math.max(this.maxY, +this.airPurifierState.PM25, +this.airPurifierState.Temperature, +this.airPurifierState.Humidity);
        this.minY = Math.min(this.minY, +this.airPurifierState.PM25, +this.airPurifierState.Temperature, +this.airPurifierState.Humidity);
        this.options = {
          vAxis: {
            textStyle: {color: '#000000'},
            gridlines: {color: 'transparent', count: 6},
            viewWindow: {min: this.minY - 5, max: this.maxY + 5}
          },
          animation: {
            duration: 1000,
            easing: 'out',
          },
          title: 'real-time charts',
          curveType: 'function',
          legend: { position: 'bottom' }
        };
        console.log(this.data);
        this.getData = !this.getData;
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
        case 0:
          return 'None';
        case 1:
          return 'Rainbow';
        case 2:
          return 'Strip blue';
        case 3:
          return 'Strip green';
        case 4:
          return 'Strip red';
        case 5:
          return 'Pulse blue';
        case 6:
          return 'Pulse green';
        case 7:
          return 'Pulse red';
        case 8:
          return 'Spectrum';
        case 9:
          return 'Auto';
      }
    }
  }

  getLightModeName(modeId: number) {
    if (this.lightModesList.find(e => e.id === +modeId)) {
      return this.lightModesList.find(e => e.id === +modeId).name;
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
  }

  changeSpeedEnable() {
    return +this.airPurifierState.LightMode !== 9 && +this.airPurifierState.LightMode !== 0;
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
