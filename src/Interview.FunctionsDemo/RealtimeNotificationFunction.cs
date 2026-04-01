using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Extensions.SignalRService;

namespace Interview.FunctionsDemo;

public sealed class RealtimeNotificationFunction
{
    [Function(nameof(RealtimeNotificationFunction))]
    [SignalROutput(HubName = "contracts", ConnectionStringSetting = "AzureSignalRConnection")]
    public SignalRMessageAction Run(
        [ServiceBusTrigger("contracts.events", "contracts.notifications", Connection = "ServiceBusConnection")]
        string message)
    {
        var evt = JsonSerializer.Deserialize<ContractEvent>(message);

        return new SignalRMessageAction("contractUpdated")
        {
            Arguments = new[]
            {
                new
                {
                    contractId = evt?.ContractId,
                    eventType = evt?.EventType,
                    occurredOn = evt?.OccurredOn
                }
            },
            GroupName = $"contract-{evt?.ContractId}"
        };
    }
}
