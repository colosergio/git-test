using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Interview.FunctionsDemo;

public sealed class ContractProcessorFunction
{
    private readonly ILogger<ContractProcessorFunction> _logger;

    public ContractProcessorFunction(ILogger<ContractProcessorFunction> logger)
    {
        _logger = logger;
    }

    [Function(nameof(ContractProcessorFunction))]
    public Task Run(
        [ServiceBusTrigger("contracts.events", "contracts.processing", Connection = "ServiceBusConnection")]
        string message,
        FunctionContext context)
    {
        var evt = JsonSerializer.Deserialize<ContractEvent>(message);

        if (evt is null)
        {
            _logger.LogWarning("Mensaje inválido. Se ignora para evitar fallas repetitivas.");
            return Task.CompletedTask;
        }

        _logger.LogInformation(
            "Procesando ContractId={ContractId}, EventId={EventId}, CorrelationId={CorrelationId}",
            evt.ContractId,
            evt.EventId,
            evt.CorrelationId);

        // TODO: aplicar idempotencia por EventId y persistencia transaccional.
        return Task.CompletedTask;
    }
}
