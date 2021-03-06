// <auto-generated />
using MMDash.Data;
using MMDash.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace MMDash.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20180209183916_LogEntryType")]
    partial class LogEntryType
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125");

            modelBuilder.Entity("MMDash.Data.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<int>("ApplicationUserId");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("Name");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("MMDash.Data.Models.CallSign", b =>
                {
                    b.Property<int>("CallSignId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Text");

                    b.HasKey("CallSignId");

                    b.ToTable("CallSigns");
                });

            modelBuilder.Entity("MMDash.Data.Models.LogEntry", b =>
                {
                    b.Property<int>("LogEntryId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CallSignId");

                    b.Property<string>("Entry");

                    b.Property<DateTime>("EntryDateTime");

                    b.Property<int>("LogEntryType");

                    b.Property<int>("ServerId");

                    b.HasKey("LogEntryId");

                    b.HasIndex("CallSignId");

                    b.HasIndex("ServerId");

                    b.ToTable("LogEntries");
                });

            modelBuilder.Entity("MMDash.Data.Models.Server", b =>
                {
                    b.Property<int>("ServerId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DisplayName");

                    b.Property<string>("LogFileLocation");

                    b.Property<int>("OrderBy");

                    b.Property<string>("ServerSearchString");

                    b.HasKey("ServerId");

                    b.ToTable("Servers");
                });

            modelBuilder.Entity("MMDash.Data.Models.Stream", b =>
                {
                    b.Property<int>("StreamId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CallSignId");

                    b.Property<string>("RepeaterId");

                    b.Property<int>("ServerId");

                    b.Property<DateTime>("StreamDateTime");

                    b.Property<string>("StreamNumber");

                    b.Property<string>("TalkGroup");

                    b.Property<string>("TimeSlot");

                    b.HasKey("StreamId");

                    b.HasIndex("CallSignId");

                    b.HasIndex("ServerId");

                    b.ToTable("Streams");
                });

            modelBuilder.Entity("MMDash.Data.Models.TalkGroup", b =>
                {
                    b.Property<int>("TalkGroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.Property<string>("Ts1Id");

                    b.Property<string>("Ts2Id");

                    b.HasKey("TalkGroupId");

                    b.ToTable("TalkGroups");
                });

            modelBuilder.Entity("MMDash.Data.Models.VoiceTransmission", b =>
                {
                    b.Property<int>("VoiceTransmissionId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CallSignId");

                    b.Property<double>("LossRate");

                    b.Property<int>("ServerId");

                    b.Property<string>("TalkGroup");

                    b.Property<DateTime>("TransmissionDateTimeEnd");

                    b.Property<DateTime>("TransmissionDateTimeStart");

                    b.HasKey("VoiceTransmissionId");

                    b.HasIndex("CallSignId");

                    b.HasIndex("ServerId");

                    b.ToTable("VoiceTransmissions");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("MMDash.Data.Models.LogEntry", b =>
                {
                    b.HasOne("MMDash.Data.Models.CallSign", "CallSign")
                        .WithMany("LogEntries")
                        .HasForeignKey("CallSignId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MMDash.Data.Models.Server", "Server")
                        .WithMany("LogEntries")
                        .HasForeignKey("ServerId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MMDash.Data.Models.Stream", b =>
                {
                    b.HasOne("MMDash.Data.Models.CallSign", "CallSign")
                        .WithMany("Streams")
                        .HasForeignKey("CallSignId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MMDash.Data.Models.Server", "Server")
                        .WithMany()
                        .HasForeignKey("ServerId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("MMDash.Data.Models.VoiceTransmission", b =>
                {
                    b.HasOne("MMDash.Data.Models.CallSign", "CallSign")
                        .WithMany()
                        .HasForeignKey("CallSignId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MMDash.Data.Models.Server", "Server")
                        .WithMany()
                        .HasForeignKey("ServerId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("MMDash.Data.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("MMDash.Data.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("MMDash.Data.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("MMDash.Data.Models.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}
