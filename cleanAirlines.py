import pandas as pd

# Define the essential columns based on your requirements
essential_columns = [
    'FlightDate', 'Reporting_Airline', 'Flight_Number_Reporting_Airline', 'Tail_Number',
    'Origin', 'Dest', 'OriginCityName', 'DestCityName', 'OriginAirportID', 'DestAirportID',
    'CRSDepTime', 'CRSArrTime', 'Year', 'Month', 'DayofMonth', 'DayOfWeek'
]

# Set chunk size
chunk_size = 100000  # Adjust based on memory

# Define the output file
output_file = 'filtered_flight_data.csv'

# Process in chunks
for chunk in pd.read_csv('airline_2m.csv', chunksize=chunk_size, usecols=essential_columns, encoding='ISO-8859-1'):
    
    # 1. Filter by Year (2010 and beyond)
    chunk = chunk[chunk['Year'] >= 2010]
    
    # 2. Handle Missing Values
    # Drop rows with missing critical information for flight identification and times
    chunk.dropna(subset=['FlightDate', 'Reporting_Airline', 'Flight_Number_Reporting_Airline', 'Origin', 'Dest', 'CRSDepTime', 'CRSArrTime'], inplace=True)
    
    # 3. Convert Date Columns
    # Ensure 'FlightDate' is in datetime format for easier manipulation
    chunk['FlightDate'] = pd.to_datetime(chunk['FlightDate'], errors='coerce')
    
    # 4. Extract City and State Abbreviation
    # Split the city and state in OriginCityName and DestCityName
    chunk[['OriginCityName', 'OriginState']] = chunk['OriginCityName'].str.split(',', expand=True)
    chunk[['DestCityName', 'DestState']] = chunk['DestCityName'].str.split(',', expand=True)
    
    # Clean up city names by taking only the first part if there is a slash (e.g., "Dallas/Fort Worth" -> "Dallas")
    chunk['OriginCityName'] = chunk['OriginCityName'].str.split('/').str[0].str.strip()
    chunk['DestCityName'] = chunk['DestCityName'].str.split('/').str[0].str.strip()
    
    # Strip whitespace from state columns
    chunk['OriginState'] = chunk['OriginState'].str.strip()
    chunk['DestState'] = chunk['DestState'].str.strip()
    
    # 5. Remove Duplicate Rows
    # Removing duplicates based on flight date, airline, and flight number to ensure uniqueness
    chunk.drop_duplicates(subset=['FlightDate', 'Reporting_Airline', 'Flight_Number_Reporting_Airline'], inplace=True)
    
    # 6. Save Cleaned Chunk to Output
    # Append mode to avoid loading all data at once
    chunk.to_csv(output_file, mode='a', index=False, header=not pd.io.common.file_exists(output_file))
