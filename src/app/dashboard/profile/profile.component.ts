import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ɵɵsetComponentScope,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfileResults } from './interfaces/profile-results.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  // this is dummy data that is overriden on ngInit
  results: Partial<ProfileResults> = {
    username: 'User',
    eloBullet: 800,
    eloRapid: 800,
    eloBlitz: 800,
    bulletNumber: 0,
    blitzNumber: 0,
    rapidNumber: 0,
  };
  params!: Params;

  bulletData: { name: string; series: { name: string; value: number }[] }[] = [
    {
      name: 'Bullet',
      series: [],
    },
  ];
  blitzData: { name: string; series: { name: string; value: number }[] }[] = [
    {
      name: 'Blitz',
      series: [],
    },
  ];
  rapidData: { name: string; series: { name: string; value: number }[] }[] = [
    {
      name: 'Rapid',
      series: [],
    },
  ];

  view: [number, number] = [680, 500];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = false;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Time';
  yAxisLabel: string = 'Elo points';
  timeline: boolean = true;

  columns = ['date', 'type', 'white', 'black', 'result'];
  totalGamesPlayed: number = 0;
  gamesData: MatTableDataSource<any>;
  loadingData: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.gamesData = new MatTableDataSource();
    this.gamesData.paginator = this.paginator;
  }

  async ngOnInit(): Promise<void> {
    this.params = await firstValueFrom(this.route.params);
    this.http
      .get<ProfileResults>(
        'http://localhost:3000/api/profile/?username=' + this.params['id'],
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .subscribe({
        next: async (data: any) => {
          if (data.results) {
            this.results = data.results;
            await this.setupChartData(data.results);
            this.totalGamesPlayed = data.results.gamesNumber;
            await this.addAdditionalGameData(
              this.paginator.pageIndex,
              this.paginator.pageSize
            );
          }
          // TODO: what if data was wrong?
        },
      });
  }

  async ngAfterViewInit(): Promise<void> {
    console.log(this.paginator.pageIndex, this.paginator.pageSize);
    this.paginator.page.subscribe(async (data) => {
      this.loadingData = true;
      await this.addAdditionalGameData(data.pageIndex, data.pageSize);
    });
  }

  private async setupChartData(chartData: ProfileResults): Promise<void> {
    this.bulletData[0].series = chartData.eloProgressionBullet?.map((data) => {
      return {
        name: new Date(data.date).toLocaleDateString('pl-PL', {
          hour: 'numeric',
          minute: 'numeric',
        }),
        value: data.elo,
      };
    });

    this.blitzData[0].series = chartData.eloProgressionBlitz?.map((data) => {
      return {
        name: new Date(data.date).toLocaleDateString('pl-PL', {
          hour: 'numeric',
          minute: 'numeric',
        }),
        value: data.elo,
      };
    });

    this.rapidData[0].series = chartData.eloProgressionRapid?.map((data) => {
      return {
        name: new Date(data.date).toLocaleDateString('pl-PL', {
          hour: 'numeric',
          minute: 'numeric',
        }),
        value: data.elo,
      };
    });
  }

  async onGameClick(row: any) {
    this.router.navigate(['/dashboard', 'analysis', row.gameId]);
  }

  private async addAdditionalGameData(page: number, pageSize: number) {
    this.http
      .get<any>(
        `http://localhost:3000/api/match-management/get-match-info?username=${this.results.username}&page=${page}&pageSize=${pageSize}`,
        {
          withCredentials: true,
          responseType: 'json',
        }
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.loadingData = false;
          this.gamesData.data = data.games.reverse();
        },
      });
  }
}
