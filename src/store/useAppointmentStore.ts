import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import {
  Appointment,
  Client,
  Service,
  StaffMember,
  mockAppointments,
  mockClients,
  mockServices,
  mockStaff,
} from '../data/mock';

interface AppState {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  staff: StaffMember[];
  
  // Actions
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  
  // Sync logic
  syncWithCloud: () => Promise<void>;
}

export const useAppointmentStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initialize with mock data (if storage is empty)
      appointments: mockAppointments,
      clients: mockClients,
      services: mockServices,
      staff: mockStaff,

      addAppointment: (appointment) => set((state) => {
        // Also push to Supabase eventually
        // supabase.from('appointments').insert(appointment);
        return { appointments: [...state.appointments, appointment] };
      }),
      
      updateAppointment: (appointment) => set((state) => {
        // supabase.from('appointments').update(appointment).eq('id', appointment.id);
        return {
          appointments: state.appointments.map(a => 
            a.id === appointment.id ? appointment : a
          )
        };
      }),

      deleteAppointment: (id) => set((state) => {
        // supabase.from('appointments').delete().eq('id', id);
        return {
          appointments: state.appointments.filter(a => a.id !== id)
        };
      }),

      syncWithCloud: async () => {
        // TODO: Real 2-way sync with Supabase
        // 1. Fetch latest from cloud
        // const { data } = await supabase.from('appointments').select('*');
        // if (data) set({ appointments: data });
        console.log('Supabase sync triggered (placeholder)');
      }
    }),
    {
      name: 'kally-offline-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);
