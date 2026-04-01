namespace Interview.FunctionsDemo;

public sealed record ContractEvent(
    string EventId,
    string ContractId,
    string EventType,
    int Version,
    DateTimeOffset OccurredOn,
    string CorrelationId);
