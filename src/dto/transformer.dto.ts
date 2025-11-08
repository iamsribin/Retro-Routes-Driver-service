import { Expose, Transform } from 'class-transformer';

export class DriverListDTO {
  @Expose({ name: '_id' })
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  mobile!: number;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value).toISOString() : value))
  joiningDate!: string;

  @Expose()
  accountStatus!: 'Good' | 'Warning' | 'Rejected' | 'Blocked' | 'Pending' | 'Incomplete';

  @Expose()
  @Transform(({ obj }) => {
    const vd = obj?.vehicleDetails;
    if (!vd) return undefined;
    if (Array.isArray(vd)) return vd[0]?.model ?? undefined;
    return vd?.model ?? undefined;
  })
  vehicle?: string;

  @Expose()
  driverImage!: string;
}
