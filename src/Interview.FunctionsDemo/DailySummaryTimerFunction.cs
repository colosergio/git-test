using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Interview.FunctionsDemo;

public sealed class DailySummaryTimerFunction
{
    private readonly ILogger<DailySummaryTimerFunction> _logger;

    public DailySummaryTimerFunction(ILogger<DailySummaryTimerFunction> logger)
    {
        _logger = logger;
    }

    [Function(nameof(DailySummaryTimerFunction))]
    public Task Run([TimerTrigger("0 0 12 * * *")] TimerInfo timer)
    {
        _logger.LogInformation("Daily summary triggered at {Timestamp}", DateTimeOffset.UtcNow);
        return Task.CompletedTask;
    }
}
