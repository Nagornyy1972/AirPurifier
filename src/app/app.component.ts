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
  public selectedMode: LightMode;

  @ViewChild('dataContainer') dataContainer: ElementRef;


  constructor(private http: HttpClient) {
    this.airPurifierState = new AirPurifierState();
  }

  ngOnInit() {
    this.getAirData(this.airPurifierState.LightMode, this.airPurifierState.Speed);
    setInterval(this.refreshData, 20000);
  }

  private refreshData() {
    let dataContainerRef = document.getElementById('dataContainer');
    if (dataContainerRef) dataContainerRef.click();
  }

  private getAirData(mode: number, speed: number) {
    const request = 'http://192.168.1.104/fanSettings?mode=' + mode + '&&speed=' + speed;
    this.http.get(request).pipe(take(1)).subscribe((data: AirPurifierState) => {
      if (!isNaN(+data.Humidity)) {
        this.airPurifierState = data;
        this.airPurifierState.Speed = 10 - this.airPurifierState.RenbowSpeed;
      } else {
      }
    });
  }

  private getColor() {
    if (this.airPurifierState) {
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
    console.log(modeId);
    if (this.lightModesList.find( e => e.id === +modeId)) {
      return this.lightModesList.find( e => e.id === +modeId).name;
    }
    return '';
  }

  checkedMode(lightMode) {
    return lightMode.id === +this.airPurifierState.LightMode;
  }

  onSelectMode(event) {
    console.log(event);
  }

  onChange(event) {
    console.log('on change');
    console.log(event);
  }
}

export class AirPurifierState {
  LightMode: number;
  RenbowSpeed: number;
  FanPower: number;
  Temperature: number;
  Humidity: number;
  PM25: number;
  Speed: number;

  constructor() {
    this.LightMode = 9;
    this.Speed = 0;
  }
}

export class LightMode {
  id: number;
  name: string;
}
