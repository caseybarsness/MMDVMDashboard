using System;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Net.Http;
using System.Text.RegularExpressions;
using MMDash.Data;
using MMDash.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace MMDash.Parser
{
    class Program
    {
        public static bool Debug { get; set; } = false;
        public static bool ReadAllLines { get; set; }
        public static int ServerId { get; set; }
        static void Main(string[] args)
        {
            for (int i = 0; i < args.Length; i++)
            {
                if (args[i].Contains("debug"))
                {
                    Debug = true;
                }
                if (args[i].Contains("server="))
                {
                    var id = 0;
                    int.TryParse(args[i].Replace("server=", ""), out id);
                    ServerId = id;
                }
            }

            ReadAllLines = false;
            if (args.Length > 0)
            {
                if (args[0] == "-update-call-times")
                {
                    if (args.Length > 1)
                    {
                        if ((args[1] == "-read-all-lines"))
                        {
                            ReadAllLines = true;
                            UpdateCallTimes();
                        }
                        else
                        {
                            UpdateCallTimes();
                        }
                    }
                    else
                    {
                    }
                }
                else if (args[0] == "-parse-ip-addresses")
                {
                    if (args.Length > 1)
                    {
                        if ((args[1] == "-read-all-lines"))
                        {
                            ReadAllLines = true;
                            ParseIpAddresses();
                        }
                        else
                        {
                            ParseIpAddresses();
                        }
                    }
                    else
                    {
                        ParseIpAddresses();
                    }
                }
                else if ((args[0] == "-read-all-lines"))
                {
                    ReadAllLines = true;
                    ParseLogs();
                }
                else if (args[0] == "-geocode")
                {
                    GeoCodeIpAddresses();
                }
                else if (args[0] == "-cleandb")
                {
                    CleanDb();
                }
                else
                {
                    ParseLogs();
                }
            }
            else
            {
                ParseLogs();
            }



        }

        static void ParseLogs()
        {

            var configBuilder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();

            Console.WriteLine("Starting Parsing");
            Console.WriteLine("Reading DB Config");
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlite(connectionString);

            var clearDbConfig = Configuration["deleteDb"];
            var clearDb = false;
            bool.TryParse(clearDbConfig, out clearDb);
            using (var db = new AppDbContext(builder.Options))
            {
                if (clearDb)
                {
                    CleanDb();
                }
                IQueryable<Server> Servers;
                if (ServerId == 0)
                {
                    Servers = db.Servers;
                }
                else
                {
                    Servers = db.Servers.Where(x => x.ServerId == ServerId);
                }
                foreach (var server in Servers)
                {
                    Console.WriteLine("Processing: " + server.ServerSearchString);
                    Console.WriteLine("File: " + server.LogFileLocation);
                    var lines = new string[0];
                    if (ReadAllLines == true)
                    {
                        Console.WriteLine("Reading All Lines");
                        lines = System.IO.File.ReadAllLines(server.LogFileLocation);
                    }
                    else
                    {
                        Console.WriteLine("Reading Last 500 Lines");
                        lines = System.IO.File.ReadLines(server.LogFileLocation).Reverse().Take(500).ToArray();
                    }
                    Console.WriteLine(lines.Count().ToString() + " Lines Read");
                    WriteDebug(server.ServerSearchString);
                    foreach (var line in lines)
                    {
                        if (line.Contains(server.ServerSearchString))
                        {
                            WriteDebug(line);
                            if (line.Contains("configuration"))
                            {
                                WriteDebug(line);
                                //INFO 2018-01-16 11:45:28,110 (Suzy-East-Spokane) Client WA7BFN   (3153439) has sent repeater configuration
                                var strDate = line.Split(',')[0].Replace("INFO ", "");
                                var date = DateTime.Now;
                                var partialLine = line.Split("(")[1];
                                var callStartIndex = partialLine.IndexOf("Client");
                                var callSignString = partialLine.Substring(callStartIndex).Replace("Client", "").Trim();   //Regex.Match(line, @"(?<=\bClient\s+)\p{L}+\p{N}+\p{L}+").Value;

                                if (callSignString.Trim().Length > 0)
                                {
                                    var radioIdStartIndex = line.IndexOf("Client");
                                    var radioIdEndIndex = line.LastIndexOf(")");
                                    var radioId = line.Substring(radioIdStartIndex, radioIdEndIndex - radioIdStartIndex).Replace(callSignString, "").Replace("(", "").Replace(callSignString, "").Replace("Client", "").Trim();
                                    DateTime.TryParse(strDate, out date);
                                    if (db.LogEntries.Where(x => x.Entry == line.Trim()).FirstOrDefault() == null)
                                    {
                                        var callSignId = db.CallSigns.Where(x => x.Text.ToUpper() == callSignString.ToUpper().Trim()).Select(x => x.CallSignId).FirstOrDefault();
                                        if (callSignId == 0)
                                        {
                                            Console.WriteLine("Adding Call Sign: " + callSignString.ToUpper().Trim());
                                            var callSign = new CallSign();
                                            callSign.Text = callSignString.ToUpper().Trim();
                                            db.CallSigns.Add(callSign);
                                            db.SaveChanges();
                                            callSignId = callSign.CallSignId;
                                        }
                                        var log = new LogEntry();
                                        log.Entry = line.Trim();
                                        log.EntryDateTime = date;
                                        log.CallSignId = callSignId;
                                        log.ServerId = server.ServerId;
                                        log.LogEntryType = LogEntryType.RepeaterConfigStart;
                                        db.LogEntries.Add(log);

                                        if (radioId != "1" && db.RadioIdLogs.Where(x => x.RadioId == radioId && x.CallSignId == callSignId).Count() == 0)
                                        {
                                            Console.WriteLine("Adding Radio ID: " + radioId + " For Call Sign: " + callSignString + " On Server: " + server.DisplayName);
                                            var radioIdLog = new RadioIdLog();
                                            radioIdLog.CallSignId = callSignId;
                                            radioIdLog.ServerId = server.ServerId;
                                            radioIdLog.RadioId = radioId;
                                            db.RadioIdLogs.Add(radioIdLog);
                                            db.SaveChanges();
                                        }
                                    }
                                }
                                else
                                {
                                    Console.WriteLine("ERROR: Call Sign not found");
                                    Console.WriteLine(line);
                                }
                            }
                            else if (line.ToLower().Contains("client is closing down"))
                            {
                                WriteDebug(line);
                                //INFO 2018-01-16 11:45:11,387 (Suzy-East-Spokane) Client is closing down: WA7BFN   (3153439)
                                var strDate = line.Split(',')[0].Replace("INFO ", "");
                                var date = DateTime.MinValue;
                                DateTime.TryParse(strDate, out date);
                                if (db.LogEntries.Where(x => x.Entry == line.Trim()).FirstOrDefault() == null)
                                {
                                    var callStartIndex = line.LastIndexOf(":") + 1;
                                    var callEndIndex = line.LastIndexOf("(") - 1;
                                    var callSignString = line.Substring(callStartIndex, callEndIndex - callStartIndex).Trim(); //Regex.Match(line, @"(?<=\bdown:\s+)\p{L}+\p{N}+\p{L}+").Value;
                                    if (callSignString.Trim().Length > 0)
                                    {

                                        var callSignId = db.CallSigns.Where(x => x.Text.ToUpper() == callSignString.ToUpper().Trim()).Select(x => x.CallSignId).FirstOrDefault();
                                        if (callSignId == 0)
                                        {

                                            var callSign = new CallSign();
                                            callSign.Text = callSignString.ToUpper().Trim();
                                            db.CallSigns.Add(callSign);
                                            db.SaveChanges();
                                            callSignId = callSign.CallSignId;
                                        }
                                        var log = new LogEntry();
                                        log.Entry = line;
                                        log.EntryDateTime = date;
                                        log.CallSignId = callSignId;
                                        log.ServerId = server.ServerId;
                                        log.LogEntryType = LogEntryType.ClientClosingDown;
                                        db.LogEntries.Add(log);
                                    }
                                    else
                                    {
                                        Console.WriteLine("ERROR: Call Sign not found");
                                        Console.WriteLine(line);
                                    }

                                }
                            }
                            else if (line.ToLower().Contains("begin ambe encode"))
                            {
                                WriteDebug(line);
                                var streamNumberStartIndex = line.IndexOf("STREAM ID:") + 1;
                                var streamNumberEndIndex = line.IndexOf("SUB") - 1;
                                var streamNumber = line.Substring(streamNumberStartIndex, streamNumberEndIndex - streamNumberStartIndex); //Regex.Match(line, @"(?<=\bSTREAM ID:\s+)\p{N}+").Value;
                                if (db.Streams.Where(x => x.StreamNumber == streamNumber).Count() == 0)
                                {
                                    var callSignString = Regex.Match(line, @"(?<=\bSUB:\s+)\p{L}+\p{N}+\p{L}+").Value;
                                    if (callSignString.Length > 1)
                                    {
                                        var strDate = line.Split(',')[0].Replace("INFO ", "");
                                        var date = DateTime.MinValue;
                                        DateTime.TryParse(strDate, out date);
                                        var repeaterIdString = Regex.Match(line, @"(?<=\bREPEATER:\s+)\p{N}+").Value;
                                        var talkGroupId = Regex.Match(line, @"(?<=\bTGID\s+)\p{N}+").Value;
                                        var timeSlot = Regex.Match(line, @"(?<=\bTS\s+)\p{N}+").Value;

                                        var callSign = db.CallSigns.Where(x => x.Text.ToUpper() == callSignString.ToUpper().Trim()).FirstOrDefault();
                                        if (callSign == null)
                                        {
                                            callSign = new CallSign();
                                            callSign.Text = callSignString.ToUpper().Trim();
                                            db.CallSigns.Add(callSign);
                                            db.SaveChanges();
                                        }
                                        var tgText = talkGroupId.Trim();
                                        if (talkGroupId.Trim().Length > 0)
                                        {
                                            var tg = db.TalkGroups.Where(x => x.Ts1Id == talkGroupId.Trim() || x.Ts2Id == talkGroupId.Trim());
                                            if (tg.Count() > 0)
                                            {
                                                tgText = tg.FirstOrDefault().Name + " (" + talkGroupId.Trim() + ")";
                                            }
                                        }

                                        var stream = new Data.Models.Stream();
                                        stream.Server = server;
                                        stream.CallSign = callSign;
                                        stream.StreamDateTime = date;
                                        stream.StreamNumber = streamNumber;
                                        stream.RepeaterId = repeaterIdString;
                                        stream.TalkGroup = tgText;
                                        stream.TimeSlot = timeSlot;
                                        db.Add(stream);
                                    }
                                    else
                                    {
                                        Console.WriteLine("ERROR: Call Sign not found");
                                        Console.WriteLine(line);
                                    }
                                }
                            }
                        }
                    }
                    Console.WriteLine("Updating DB");
                    db.SaveChanges();
                }
                Console.WriteLine("Updating DB");
                db.SaveChanges();
            }
        }

        static void UpdateCallTimes()
        {
            var configBuilder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();

            Console.WriteLine("Starting Time Parsing");
            Console.WriteLine("Reading DB Config");
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlite(connectionString);

            var clearDbConfig = Configuration["deleteDb"];
            var clearDb = false;
            bool.TryParse(clearDbConfig, out clearDb);


            using (var db = new AppDbContext(builder.Options))
            {

                if (clearDb)
                {
                    foreach (var trams in db.VoiceTransmissions)
                    {
                        db.VoiceTransmissions.Remove(trams);
                    }
                    db.SaveChanges();
                }

                IQueryable<Server> Servers;
                if (ServerId == 0)
                {
                    Servers = db.Servers;
                }
                else
                {
                    Servers = db.Servers.Where(x => x.ServerId == ServerId);
                }
                foreach (var server in Servers)
                {
                    Console.WriteLine("Processing: " + server.ServerSearchString);

                    var fileLines = new string[0];
                    if (ReadAllLines == true)
                    {
                        fileLines = System.IO.File.ReadAllLines(server.LogFileLocation);
                    }
                    else
                    {
                        fileLines = System.IO.File.ReadLines(server.LogFileLocation).Reverse().Take(1500).ToArray();
                    }

                    for (int i = 0; i < fileLines.Length - 1; i++)
                    {
                        var line = fileLines[i];
                        if (line.Contains("Voice Transmission Start"))
                        {
                            var line2 = "";
                            for (int i2 = 1; i2 < 11; i2++)
                            {
                                if (fileLines[i + i2].Contains("Voice Transmission End"))
                                {
                                    line2 = fileLines[i + i2];
                                    break;
                                }
                            }

                            if (line2.Contains("Voice Transmission End"))
                            {
                                var transmission = new VoiceTransmission();
                                var strStartDate = line.Split(',')[0].Replace("INFO ", "");
                                var startDate = DateTime.Now;
                                var strEndDate = line2.Split(',')[0].Replace("INFO ", "");
                                var endDate = DateTime.Now;
                                DateTime.TryParse(strStartDate, out startDate);
                                DateTime.TryParse(strEndDate, out endDate);

                                var strCallSign = line.Substring(line.IndexOf("from")).Replace("from", "").Trim();
                                var index1 = line.IndexOf("(");
                                var index2 = line.IndexOf(")");
                                var talkGroup = line.Substring(index1 + 1, index2 - index1 - 1).Trim();
                                var lostRateIndex = line2.LastIndexOf(":");
                                var strLossRate = line2.Substring(lostRateIndex + 1, 5).Trim();
                                var lossRate = new double();
                                double.TryParse(strLossRate, out lossRate);


                                var callSign = db.CallSigns.Where(x => x.Text.ToUpper() == strCallSign.ToUpper().Trim()).FirstOrDefault();
                                if (callSign == null)
                                {
                                    callSign = new CallSign();
                                    callSign.Text = strCallSign.ToUpper().Trim();
                                    db.CallSigns.Add(callSign);
                                    db.SaveChanges();
                                }

                                var tg = db.TalkGroups.Where(x => x.Ts1Id == talkGroup.Trim() || x.Ts2Id == talkGroup.Trim());
                                if (tg.Count() > 0)
                                {
                                    talkGroup = tg.FirstOrDefault().Name + " (" + talkGroup.Trim() + ")";
                                }

                                if (db.VoiceTransmissions.Where(x => x.CallSign == callSign &&
                                                                x.TransmissionDateTimeStart == startDate &&
                                                                x.TransmissionDateTimeEnd == endDate &&
                                                                x.TalkGroup == talkGroup &&
                                                                x.LossRate == lossRate &&
                                                                x.Server == server).Count() == 0)
                                {
                                    transmission.CallSign = callSign;
                                    transmission.TransmissionDateTimeStart = startDate;
                                    transmission.TransmissionDateTimeEnd = endDate;
                                    transmission.TalkGroup = talkGroup;
                                    transmission.LossRate = lossRate;
                                    transmission.Server = server;
                                    db.Add(transmission);
                                }

                            }
                        }
                    }
                    db.SaveChanges();
                }
            }
        }

        static void CleanDb()
        {
            Console.WriteLine("Cleaning DB");

            var configBuilder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();

            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlite(connectionString);

            using (var db = new AppDbContext(builder.Options))
            {
                foreach (var log in db.LogEntries)
                {
                    db.LogEntries.Remove(log);
                }
                foreach (var trams in db.VoiceTransmissions)
                {
                    db.VoiceTransmissions.Remove(trams);
                }
                foreach (var stream in db.Streams)
                {
                    db.Streams.Remove(stream);
                }
                foreach (var ipLog in db.IpLogs)
                {
                    db.IpLogs.Remove(ipLog);
                }
                foreach (var radioIdLog in db.RadioIdLogs)
                {
                    db.RadioIdLogs.Remove(radioIdLog);
                }
                foreach (var callsign in db.CallSigns)
                {
                    db.CallSigns.Remove(callsign);
                }

                db.SaveChanges();
            }

        }

        static void ParseIpAddresses()
        {
            var configBuilder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();

            Console.WriteLine("Starting Parsing Ip Addresses");
            Console.WriteLine("Reading DB Config");
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlite(connectionString);


            var clearDbConfig = Configuration["deleteDb"];
            var clearDb = false;
            bool.TryParse(clearDbConfig, out clearDb);

            using (var db = new AppDbContext(builder.Options))
            {
                if (clearDb)
                {
                    Console.WriteLine("Clearing IP Logs");
                    foreach (var ipLog in db.IpLogs)
                    {
                        db.IpLogs.Remove(ipLog);
                    }
                    db.SaveChanges();
                }

                IQueryable<Server> Servers;
                if (ServerId == 0)
                {
                    Servers = db.Servers;
                }
                else
                {
                    Servers = db.Servers.Where(x => x.ServerId == ServerId);
                }
                foreach (var server in Servers)
                {
                    Console.WriteLine("Processing: " + server.ServerSearchString);
                    var lines = new string[0];
                    if (ReadAllLines == true)
                    {
                        lines = System.IO.File.ReadAllLines(server.LogFileLocation);
                    }
                    else
                    {
                        lines = System.IO.File.ReadLines(server.LogFileLocation).Reverse().Take(200).ToArray();
                    }
                    foreach (var radioId in db.RadioIdLogs)
                    {
                        foreach (var line in lines)
                        {
                            if (line.Contains(radioId.RadioId) && line.Contains("Repeater Logging in with Radio ID"))
                            {
                                var strDate = line.Split(',')[0].Replace("INFO ", "");
                                var date = DateTime.MinValue;
                                DateTime.TryParse(strDate, out date);
                                var ipStartIndex = line.LastIndexOf(",");
                                var ipEndIndex = line.LastIndexOf(":");
                                var ipAddress = line.Substring(ipStartIndex, ipEndIndex - ipStartIndex).Replace(",", "").Trim();
                                var existingLog = db.IpLogs.Where(x => x.RadioIdLogId == radioId.RadioIdLogId && x.IpAddress == ipAddress).FirstOrDefault();
                                if (existingLog == null)
                                {
                                    Console.WriteLine("Adding IP Log for " + radioId.RadioId + " IP: " + ipAddress + " Date: " + date);
                                    var ipLog = new IpLog();
                                    ipLog.RadioIdLogId = radioId.RadioIdLogId;
                                    ipLog.LogDateTime = date;
                                    ipLog.IpAddress = ipAddress;
                                    db.IpLogs.Add(ipLog);
                                    db.SaveChanges();
                                }
                                else
                                {
                                    Console.WriteLine("Updating Date for IP Log " + radioId.RadioId + " IP: " + ipAddress + " Date: " + date);
                                    existingLog.LogDateTime = date;
                                    db.SaveChanges();
                                }
                            }
                        }
                    }
                    db.SaveChanges();
                }


            }
        }

        static void GeoCodeIpAddresses()
        {
            var configBuilder = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();

            Console.WriteLine("Starting Geocoding Ip Addresses");
            Console.WriteLine("Reading DB Config");
            var builder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlite(connectionString);


            var clearDbConfig = Configuration["deleteDb"];
            var clearDb = false;
            bool.TryParse(clearDbConfig, out clearDb);

            using (var db = new AppDbContext(builder.Options))
            {
                foreach (var ip in db.IpLogs.Where(x => x.Lat == null && x.Long == null))
                {
                    using (var client = new HttpClient())
                    {
                        var strUrl = "http://freegeoip.net/json/" + ip.IpAddress;
                        HttpResponseMessage httpResponse = client.GetAsync(strUrl).Result;
                        if (httpResponse.IsSuccessStatusCode)
                        {
                            var result = httpResponse.Content.ReadAsStringAsync().Result;
                            var json = JsonConvert.DeserializeObject<RootObject>(result);
                            if (json.latitude.Length > 2 && json.longitude.Length > 2)
                            {
                                ip.Lat = json.latitude;
                                ip.Long = json.longitude;
                                Console.WriteLine("Location for IP: " + ip.IpAddress + " - " + json.latitude + "," + json.longitude);
                                db.SaveChanges();
                            }
                        }
                    }
                    System.Threading.Thread.Sleep(1000);
                }
            }
        }

        public class RootObject
        {
            public string ip { get; set; }
            public string country_code { get; set; }
            public string country_name { get; set; }
            public string region_code { get; set; }
            public string region_name { get; set; }
            public string city { get; set; }
            public string zip_code { get; set; }
            public string time_zone { get; set; }
            public string latitude { get; set; }
            public string longitude { get; set; }
            public int metro_code { get; set; }
        }

        static void WriteDebug(string str)
        {
            if (Debug)
            {
                Console.WriteLine(str);
            }
        }
    }
}
