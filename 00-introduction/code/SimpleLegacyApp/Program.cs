using System;
using System.Configuration;
using System.Web;

namespace SimpleLegacyApp
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            Console.WriteLine("SimpleLegacyApp — demo for GitHub Copilot app modernization.");

            var appName = ConfigurationManager.AppSettings["AppName"] ?? "SimpleLegacyApp";

            var context = HttpContext.Current; // BLOCKER: not available in .NET 10
            Console.WriteLine($"App: {appName}, HttpContext present: {context != null}");

            var sample = new SampleData { Id = 1, Name = "Neo" };
            var bytes = Serialization.Serialize(sample);
            var restored = Serialization.Deserialize<SampleData>(bytes);
            Console.WriteLine($"Restored: {restored.Id} / {restored.Name}");

            Console.WriteLine("Done. Press any key to exit.");
            Console.ReadKey();
        }
    }

    [Serializable]
    public class SampleData
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
