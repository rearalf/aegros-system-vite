import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { nameSplit, roundDate, getAge } from '../utils/Utils'
import { formatDate } from '../utils/FormatDate'
import { patientDefault, patientInterface } from '../Interface/PatientsInterface'
import { appointmentDefault, appointmentInterface } from '../Interface/AppointmentsInterface'
import NotificationContex from '../context/NotificationContext'

function useUpdateAppointment(){
	const navigate = useNavigate()
	const { id } = useParams()
	const { setNotification } = useContext(NotificationContex)
	const [ appointment, setAppointment ] = useState<appointmentInterface>(appointmentDefault)
	const [ appointmentsToday, setAppointmentsToday ] = useState([])
	const [ patient, setPatient ] = useState<patientInterface>(patientDefault)
	const [ loading, setLoading ] = useState(true)
	const [ loadingSchedule, setLoadingSchedule ] = useState(true)

	const getAppointment = async () => {
		try {
			const result = await window.ipcRenderer.sendSync('get-appointment-main', {
				id,
			})
			if (!result.success) {
				console.log(result)
				throw 'Ocurrio un error'
			}
			const appointment_result = JSON.parse(result.appointment)
			const patient_result = JSON.parse(result.patient)
			formatPatient(patient_result)
			setAppointment(appointment_result)
			setLoading(false)
		} catch (error) {
			const err = error as any
			navigate(-1)
			setLoading(false)
			console.log(error)
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Error',
				subTitleNotification: err,
				typeNotification: 'error',
			})
		}
	}

	const formatPatient = (data: any) => {
		const { patient_date_birth, patient_name } = data
		data.patient_age = getAge(patient_date_birth)
		data.patient_name_short = nameSplit(patient_name)
		data.patient_date_birth_format = formatDate({
			date: patient_date_birth,
			formatDate: 'dd / MMMM / yyyy',
		})
		setPatient(data)
	}

	const handleChangeInpuDate = (value: any) => {
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
			const result = await window.ipcRenderer.sendSync('update-appointment-date-main', {
				id,
				appointment_date,
			})
			if (!result.success) throw 'Ocurrio un error.'
			navigate(`/private/appointments/${id}`)
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Operación exitosa.',
				subTitleNotification: `Fecha de la cita actualizada.`,
				typeNotification: 'success',
			})
		} catch (error) {
			const err = error as any
			console.log(error)
			setNotification({
				isOpenNotification: true,
				titleNotification: 'Error',
				subTitleNotification: err,
				typeNotification: 'error',
			})
		}
	}

	const handleCancelUpdate = () => {
		navigate(-1)
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
				const appointment_date_split = formatDate({
					date: appointment_date,
					formatDate: 'd/M/yyyy',
				}).split('/')
				const result = await window.ipcRenderer.sendSync(
					'get-all-appointments-of-the-day-main',
					{
						dateYear: appointment_date_split[2],
						dateMonth: parseInt(appointment_date_split[1]) - 1,
						dateDay: appointment_date_split[0],
					},
				)
				if (!result.success) {
					throw result
				}
				const appointments_result = JSON.parse(result.appointments)
				setAppointmentsToday(appointments_result)
				setLoadingSchedule(false)
			}
		} catch (error) {
			setLoadingSchedule(false)
			console.log(error)
		}
	}

	const validShowContent = loading ? 'hide' : ''
	const link = '/private/appointments'
	const linksBreadCrumbs = [
		{
			link_name: 'Citas',
			link_to: link,
		},
		{
			link_name: patient.patient_name ? `Cita de ${patient.patient_name_short}` : '',
			link_to: `${link}/${id}`,
		},
		{
			link_name: 'Modificar fecha de cita',
			link_to: `${link}/update-appointment/${id}`,
		},
	]

	useEffect(() => {
		setTimeout(() => getAppointment(), 1000)
	}, [])

	useEffect(
		() => {
			setLoadingSchedule(true)
			setTimeout(() => getAllAppointmentsOfTheDay(), 1000)
		},
		[ appointment.appointment_date ],
	)

	return {
		validShowContent,
		loading,
		loadingSchedule,
		appointment,
		patient,
		appointmentsToday,
		linksBreadCrumbs,
		handleChangeInpuDate,
		handleUpdateAppointmentDate,
		handleCancelUpdate,
	}
}

export default useUpdateAppointment
