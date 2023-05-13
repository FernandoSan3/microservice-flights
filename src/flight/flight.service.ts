import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FLIGHT } from "./common/models/models";
import { Model } from "mongoose";
import { IFlight } from "./common/interfaces/flight.interface";
import { ILocation } from "./common/interfaces/location.interface";
import axios from "axios";
import { IWeather } from "./common/interfaces/weather.interface";
import moment from "moment";
import { FlightDTO } from "./dto/flight.dto";



@Injectable()
export class FlightService{

    constructor( 
        @InjectModel(FLIGHT.name)
        private readonly model: Model<IFlight>
    ){}

    async getLocation( destinationCity: string): Promise<ILocation>{
    const { data} = await axios.get(
        `https://www.metaweather.com/api/location/search/?query=${destinationCity}`,
    );
    return data[0];
    }

    async getWeather(woeid: number, flightDate: Date): Promise<IWeather[]>{
        const dateFormat = moment.utc(flightDate).format();
        const year = dateFormat.slice(0, 4);
        const month = dateFormat.slice(5, 7);
        const day = dateFormat.slice(8, 10);
        const { data } = await axios.get(
            `https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}`,
        );
        return data;
    }

    assign( { _id, pilot, airplane, destinationCity, flightDate, passengers}: IFlight, weather: IWeather[]): IFlight{
        return  Object.assign({
            _id,
            pilot,
            airplane,
            destinationCity,
            flightDate,
            passengers,
            weather
        }
        );
    }

    async create( flightDTO: FlightDTO): Promise<IFlight>{
        const newFlight = new this.model(flightDTO);
        return await newFlight.save();
    }

    async findAll(): Promise<IFlight[]>{
        return await this.model.find().populate('passangers');
    }

    async findOne(id: string): Promise<IFlight>{
        const flight =  await this.model.findById(id).populate('passangers');
        const  location: ILocation  = await this.getLocation(flight.destinationCity);
        const weather : IWeather[] = await this.getWeather(location.woeid, flight.flightDate);

        return this.assign(flight, weather);
    }

    async update(id: string, flightDTO: FlightDTO): Promise<IFlight>{
        return await this.model.findByIdAndUpdate(id, flightDTO, {new: true});
    }

    async delete(id: string){
        await this.model.findByIdAndDelete(id);
        return {
            status: 200,
            message: 'Flight deleted successfully'
        };
    }

    async addPassenger(flightId: string, passengerId: string): Promise<IFlight>{
        return await this.model.findByIdAndUpdate(
            flightId,
            {
                $addToSet: { passengers: passengerId}
            },
            {new: true}
        );
    }
}