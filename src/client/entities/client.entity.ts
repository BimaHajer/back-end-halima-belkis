/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';

@Entity("clients")
export class Client {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @ApiProperty()
  @Column("text", { name: "email", nullable: false, unique: true })
  email: string;

  @ApiProperty()
  @Column("text", { name: "firstName", nullable: false })
  firstName: string;

  @ApiProperty()
  @Column("text", { name: "lastName", nullable: false })
  lastName: string;

  @ApiProperty()
  @Column("text", { name: "phone", nullable: false })
  phone: string;

  @ApiProperty()
  @Column("text", { name: "address", nullable: false })
  address: string;

  @ApiProperty()
  @Column("text", { name: "zipCode", nullable: false })
  zipCode: string;

  @ApiProperty()
  @Column("boolean", { name: "active", nullable: true, default: true })
  active: boolean | false;

  @ApiProperty()
  @Column("timestamp with time zone", { name: "createdAt", nullable: true })
  createdAt: Date | null;

  @ApiProperty()
  @Column("integer", { name: "createdBy", nullable: true })
  createdBy: number | null;

  @ApiProperty()
  @Column("timestamp with time zone", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @ApiProperty()
  @Column("integer", { name: "updatedBy", nullable: true })
  updatedBy: number | null;

  @ApiProperty()
  @Column("timestamp with time zone", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;


  @BeforeInsert()
  eventCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  eventUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeRemove()
  eventDeletedAt() {
    this.deletedAt = new Date();
  }
}
