import { ResultadoResp } from './resultado.interface';

export class Resultado<ResultadoEntity> {
  public results: ResultadoEntity[];
  public status: boolean;

  constructor(resp: ResultadoResp<ResultadoEntity>) {
    this.results = resp.results;
    this.status = resp.status;
  }
}
