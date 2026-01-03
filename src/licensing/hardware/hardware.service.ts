import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class HardwareService {
  
  /**
   * Obtiene el UUID único de la máquina (OS UUID).
   * Este ID es ideal porque no cambia aunque se formatee el disco en muchos casos.
   */
  async getMachineId(): Promise<string> {
    try {
      const data = await si.uuid();
      return data.os; // Retorna el identificador único del hardware/SO
    } catch (error) {
      throw new InternalServerErrorException('No se pudo obtener el identificador de hardware');
    }
  }

  /**
   * (Opcional) Obtiene información combinada para una "huella digital" más estricta
   */
  async getHardwareFingerprint(): Promise<string> {
    const system = await si.system();
    const baseboard = await si.baseboard();
    // Concatenamos marca, modelo y serial de la placa base
    return `${system.manufacturer}-${system.model}-${baseboard.serial}`;
  }
}