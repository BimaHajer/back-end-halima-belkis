import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("providers")
export class provider{
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: "id" })
  id: number

  @ApiProperty()
  @Column("text", { name: "firstName", nullable: true })
  firstName: string | null;

  @ApiProperty()
  @Column("text", { name: "lastName", nullable: true })
  lastName: string | null;

  @ApiProperty()
  @Column("text", { name: "email", nullable: true, unique: true })
  email: string | null;

  @ApiProperty()
  @Column("text", { name: "phone", nullable: true })
  phone: string | null;

  @ApiProperty()
  @Column("text", { name: "address", nullable: true })
  adresse: string | null;

  @ApiProperty()
  @Column("text", { name: "zipCode", nullable: true })
  zipCode: string | null;

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