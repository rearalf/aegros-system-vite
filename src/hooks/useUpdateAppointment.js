import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { roundDate } from '../utils/utils'
import notificationContext from '@context/notificationContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import format from 'date-fns/format'

function useUpdateAppointment(id_appointment){
	const navigate = useNavigate()
	const { setNotification } = useContext(notificationContext)
	const [ appointment, setAppointment ] = useState({})
	const [ appointmentsToday, setAppointmentsToday ] = useState([])
	const [ patient, setPatient ] = useState({
		patient_name: '',
		patient_age: 0,
	})
	const [ loading, setLoading ] = useState(true)
	const [ loadingSchedule, setLoadingSchedule ] = useState(true)

	const getAppointment = async () => {
		try {
			const result = await ipcRenderer.sendSync('get-appointment-main', {
				id: id_appointment,
			})
			if (!result.success) {
				console.log(result)
				throw 'Ocurrio un error'
			}
			const appointment_result = JSON.parse(result.appointment)
			const patient_result = JSON.parse(result.patient)
			const { patient_date_birth } = patient_result
			/* Calculate age */
			const resultAge = formatDistanceToNow(new Date(patient_date_birth))
			if (
				new Date(patient_date_birth).getMonth() === 0 ||
				new Date(patient_date_birth).getMonth() === 1 ||
				new Date(patient_date_birth).getMonth() === 2
			) {
				const patient_age = resultAge.split(' ')[1] - 1
				patient_result.patient_age = patient_age
			}
			else {
				const patient_age = resultAge.split(' ')[1]
				patient_result.patient_age = patient_age
			}
			setAppointment(appointment_result)
			setPatient(patient_result)
			setLoading(!loading)
		} catch (error) {
			navigate(-1)
			setLoading(false)
			setLoading(!loading)
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Error',
				subTitleNotification: error,
				typeNotification: 'error',
			})
		}
	}

	const handleChangeInpuDate = value => {
		try {
			setAppointment({
				...appointment,
				appointment_date: value,
			})
		} catch (error) {
			console.log(error)
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Error',
				subTitleNotification: 'Ocurrio un error',
				typeNotification: 'error',
			})
		}
	}

	const handleUpdateAppointmentDate = async () => {
		try {
			const { appointment_date } = appointment
			const currentDate = roundDate()
			const currentDateDay = currentDate.getDate()
			const appointment_date_day = new Date(appointment_date).getDate()
			if (currentDateDay === appointment_date_day) {
				if (currentDate.getTime() > new Date(appointment_date).getTime()) {
					throw 'La fecha seleccionada es menor a la fecha actual'
				}
			}
			const result = await ipcRenderer.sendSync('update-appointment-datet-main', {
				id: id_appointment,
				appointment_date,
			})
			navigate(`/appointments/${id_appointment}`)
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Operación exitosa.',
				subTitleNotification: `Fecha de la cita actualizada.`,
				typeNotification: 'success',
			})
		} catch (error) {
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Error',
				subTitleNotification: error,
				typeNotification: 'error',
			})
		}
	}

	const handleCancelUpdate = () => {
		navigate(`/appointments/${id_appointment}`)
		setNotification({
			isOpenNotification: true,
			titleNotification: 'Información',
			subTitleNotification: 'Se cancelo la modificación de la fecha.',
			typeNotification: 'information',
		})
	}

	const getAllAppointmentsOfTheDay = async () => {
		try {
			const { appointment_date } = appointment
			if (appointment_date) {
				const appointment_date_split = format(new Date(appointment_date), 'd/M/yyyy').split(
					'/',
				)
				const result = await ipcRenderer.sendSync('get-all-appointments-of-the-day-main', {
					dateYear: appointment_date_split[2],
					dateMonth: appointment_date_split[1] - 1,
					dateDay: appointment_date_split[0],
				})
				if (!result.success) {
					throw result
				}
				const appointments_result = JSON.parse(result.appointments)
				setAppointmentsToday(appointments_result)
				setLoadingSchedule(true)
			}
		} catch (error) {
			setLoadingSchedule(true)
			console.log(error)
		}
	}

	useEffect(() => {
		setLoading(!loading)
		getAppointment()
	}, [])

	useEffect(
		() => {
			setLoadingSchedule(false)
			getAllAppointmentsOfTheDay()
		},
		[ appointment.appointment_date ],
	)

	return {
		loading,
		loadingSchedule,
		appointment,
		patient,
		appointmentsToday,
		handleChangeInpuDate,
		handleUpdateAppointmentDate,
		handleCancelUpdate,
	}
}

export default useUpdateAppointment