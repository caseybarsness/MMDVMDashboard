using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MMDash.Data.Migrations
{
    public partial class IpAddressLogging : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RadioIdLogs",
                columns: table => new
                {
                    RadioIdLogId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CallSignId = table.Column<int>(nullable: false),
                    RadioId = table.Column<string>(nullable: true),
                    ServerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RadioIdLogs", x => x.RadioIdLogId);
                    table.ForeignKey(
                        name: "FK_RadioIdLogs_CallSigns_CallSignId",
                        column: x => x.CallSignId,
                        principalTable: "CallSigns",
                        principalColumn: "CallSignId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RadioIdLogs_Servers_ServerId",
                        column: x => x.ServerId,
                        principalTable: "Servers",
                        principalColumn: "ServerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IpLogs",
                columns: table => new
                {
                    IpLogId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IpAddress = table.Column<string>(nullable: true),
                    Lat = table.Column<string>(nullable: true),
                    LogDateTime = table.Column<DateTime>(nullable: false),
                    Long = table.Column<string>(nullable: true),
                    RadioIdLogId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IpLogs", x => x.IpLogId);
                    table.ForeignKey(
                        name: "FK_IpLogs_RadioIdLogs_RadioIdLogId",
                        column: x => x.RadioIdLogId,
                        principalTable: "RadioIdLogs",
                        principalColumn: "RadioIdLogId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IpLogs_RadioIdLogId",
                table: "IpLogs",
                column: "RadioIdLogId");

            migrationBuilder.CreateIndex(
                name: "IX_IpLogs_RadioId",
                table: "RadioIdLogs",
                column: "RadioId");

            migrationBuilder.CreateIndex(
                name: "IX_RadioIdLogs_CallSignId",
                table: "RadioIdLogs",
                column: "CallSignId");

            migrationBuilder.CreateIndex(
                name: "IX_RadioIdLogs_ServerId",
                table: "RadioIdLogs",
                column: "ServerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IpLogs");

            migrationBuilder.DropTable(
                name: "RadioIdLogs");
        }
    }
}
