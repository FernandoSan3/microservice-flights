export enum RabbitMQ{
    FlightQueue = 'flights',
}

export enum FlightMSG{
    CREATE='CREATE_FLIGHT',
    FIND_ALL='FIND_ALL_FLIGHTS',
    FIND_ONE='FIND_ONE_FLIGHT',
    UPDATE='UPDATE_FLIGHT',
    DELETE='DELETE_FLIGHT',
    ADD_PASSENGER='ADD_PASSENGER',
}