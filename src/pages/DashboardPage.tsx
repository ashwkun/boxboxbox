import React, { useEffect, useState } from 'react';
import * as jolpica from '../services/api/jolpica';
import { Race } from '../services/api/jolpica';
import Header from '../components/Header';
import NextRaceHero from '../components/dashboard/NextRaceHero';
import RaceSchedule from '../components/dashboard/RaceSchedule';
import CompletedRaces from '../components/dashboard/CompletedRaces';
import DriverStandings from '../components/dashboard/DriverStandings';
import ConstructorStandings from '../components/dashboard/ConstructorStandings';

const DashboardPage: React.FC = () => {
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [raceSchedule, setRaceSchedule] = useState<Race[]>([]);
  const [loading, setLoading] = useState({
    race: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching next race data...');
        const [nextRaceData, scheduleData] = await Promise.all([
          jolpica.fetchNextRace(),
          jolpica.fetchRaceSchedule()
        ]);
        console.log('Next race data:', nextRaceData);
        setNextRace(nextRaceData);
        setRaceSchedule(scheduleData);
        setLoading(prev => ({ ...prev, race: false }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading({
          race: false
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8 max-w-[1600px]">
        <Header />
        <div className="space-y-3 sm:space-y-4 md:space-y-8">
          <NextRaceHero race={nextRace} loading={loading.race} />
          <RaceSchedule races={raceSchedule} />
          <CompletedRaces races={raceSchedule} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <DriverStandings className="h-full" />
            <ConstructorStandings className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 