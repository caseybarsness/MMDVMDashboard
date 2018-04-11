using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace MMDash.Netwatch
{
    class Program
    {
        static void Main(string[] args)
        {
            //GetNetwatchData();
            MainAsync().Wait();
        }

        static void GetNetwatchData()
        {
            var run = true;
            var configBuilder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();
            var updateNumber = "";
            var url = Configuration["netwatchUrl"];
            var client = new System.Net.Http.HttpClient();
            while (run)
            {
                if (updateNumber.Length > 0)
                {
                    url += "&updatenumber=" + updateNumber;
                }
                var result = client.GetStringAsync(url);
                updateNumber = result.Result.Split((char)8)[1].Split("	")[0];
                if (result.Result.Length <= 5000)
                {
                    var streams = result.Result.Split((char)8)[0].Split("	");
                    foreach (var stream in streams)
                    {
                        var values = Regex.Replace(stream, "\x0B", ",");
                        var cleanValues = Regex.Replace(values, "[\x00-\x08\x0B\x0C\x0E-\x1F\x26]", "").Replace("nbsp", "").Replace(";", "");
                        if (cleanValues.Length > 15)
                        {
                            Console.WriteLine(cleanValues);

                        }
                    }
                }
                Console.WriteLine(updateNumber);
                Console.WriteLine(url);
                url = Configuration["netwatchUrl"];
                Thread.Sleep(1300);
            }
        }

        static async Task MainAsync()
        {
            var configBuilder = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json");
            var Configuration = configBuilder.Build();

            var baseUrl = Configuration["signalRUrl"];
            var connection = new HubConnectionBuilder()
                .WithUrl(baseUrl)
                .WithConsoleLogger(LogLevel.Warning)
                .Build();
            connection.On<string>("Send", Console.WriteLine);
            try
            {
                var closeTcs = new TaskCompletionSource<object>();
                //connection.Closed += () => closeTcs.SetResult(null);
                // Set up handler
                connection.On<string>("Send", Console.WriteLine);

                await ConnectAsync(connection);

                Console.WriteLine("Connected to {0}", baseUrl);

                var sendCts = new CancellationTokenSource();

                Console.CancelKeyPress += async (sender, a) =>
                {
                    a.Cancel = true;
                    Console.WriteLine("Stopping loops...");
                    sendCts.Cancel();
                    await connection.DisposeAsync();
                };

               
                var updateNumber = "";
                var url = Configuration["netwatchUrl"];
                var client = new System.Net.Http.HttpClient();

                while (!closeTcs.Task.IsCompleted)
                {
                    //var completedTask = await Task.WhenAny(Task.Run(() => Console.ReadLine()), closeTcs.Task);
                    //if (completedTask == closeTcs.Task)
                    //{
                    //    break;
                    //}

                    //var line = await (Task<string>)completedTask;

                    //if (line == null)
                    //{
                    //    break;
                    //}

                    if (updateNumber.Length > 0)
                    {
                        url += "&updatenumber=" + updateNumber;
                    }
                    var result = client.GetStringAsync(url);
                    updateNumber = result.Result.Split((char)8)[1].Split("	")[0];
                    var line = "";
                    if (result.Result.Length <= 5000)
                    {
                        var streams = result.Result.Split((char)8)[0].Split("	");
                        foreach (var stream in streams)
                        {
                            var values = Regex.Replace(stream, "\x0B", ",");
                            var cleanValues = Regex.Replace(values, "[\x00-\x08\x0B\x0C\x0E-\x1F\x26]", "").Replace("nbsp", "").Replace(";", "");
                            if (cleanValues.Length > 15)
                            {
                                line += cleanValues + "|";
                            }
                        }
                    }
                    if (line.Length > 0)
                    {
                        await connection.InvokeAsync<object>("Send", line.Trim().TrimEnd('|'), sendCts.Token);
                        url = Configuration["netwatchUrl"];
                    }
                    Thread.Sleep(1300);
                }
            }
            catch (AggregateException aex) when (aex.InnerExceptions.All(e => e is OperationCanceledException))
            {
            }
            catch (OperationCanceledException)
            {
            }
            finally
            {
                await connection.DisposeAsync();
            }
        }


        private static async Task ConnectAsync(HubConnection connection)
        {
            // Keep trying to until we can start
            while (true)
            {
                try
                {
                    await connection.StartAsync();
                    return;
                }
                catch (Exception)
                {
                    await Task.Delay(1000);
                }
            }
        }
    }
}
