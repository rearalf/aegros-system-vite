import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '@page/Login'
import NewUser from '@page/NewUser'
import Dashboard from '@page/Dashboard/index'
import PatientTemplate from '@page/Patient/index'
import Patients from '@page/Patient/Patients'
import CreatePatient from '@page/Patient/CreatePatient'
import Patient from '@page/Patient/Patient'
import AppointmentTemplate from '@page/Appointment/index'
import Appointments from '@page/Appointment/Appointments'
import Appointment from '@page/Appointment/Appointment'
import CreateAppointment from '@page/Appointment/CreateAppointment'
import UpdateAppointment from '@page/Appointment/UpdateAppointment'
import UserTemplate from '@page/User/index'
import Users from '@page/User/Users'
import CreateUser from '@page/User/CreateUser'
import Profile from '@page/User/Profile'
import System from '@page/System'
import PublicLayout from '@layout/PublicLayout'
import PrivateLayout from '@layout/PrivateLayout'
import UpdateUser from '@page/User/UpdateUser'

const Routers = () => (
	<HashRouter>
		<Routes>
			<Route path="/" element={<PublicLayout />}>
				<Route index element={<Login />} />
				<Route path="/new-user" element={<NewUser />} />
			</Route>
			<Route path="private" element={<PrivateLayout />}>
				<Route index element={<Dashboard />} />
				<Route path="patients" element={<PatientTemplate />}>
					<Route index element={<Patients />} />
					<Route path=":id" element={<Patient />} />
					<Route path="update-patient/:id_patient" element={<CreatePatient />} />
					<Route path="create-patient" element={<CreatePatient />} />
				</Route>
				<Route path="appointments" element={<AppointmentTemplate />}>
					<Route index element={<Appointments />} />
					<Route path=":appointment__id" element={<Appointment />} />
					<Route path="creat-appointment" element={<CreateAppointment />} />
					<Route path="creat-appointment/:patient_id" element={<CreateAppointment />} />
					<Route path="update-appointment/:id" element={<UpdateAppointment />} />
				</Route>
				<Route path="users" element={<UserTemplate />}>
					<Route index element={<Users />} />
					<Route path="create-user" element={<CreateUser />} />
					<Route path="update-user/:id" element={<UpdateUser />} />
					<Route path=":id" element={<Profile />} />
				</Route>
				<Route path="profile" element={<Profile />} />
				<Route path="system" element={<System />} />
				<Route path="*" element={<Dashboard />} />
			</Route>
		</Routes>
	</HashRouter>
)

export default Routers
