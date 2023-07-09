/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [],
  exports: [JwtModule],
})
export class JwtAuthModule {}
