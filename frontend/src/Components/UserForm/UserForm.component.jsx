import { useEffect } from "react";
import { useForm } from "react-hook-form";

const UserForm = ({ onFormSubmit, initialData, title }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        if (initialData) {
            setValue("name", initialData.name);
            setValue("username", initialData.username);
        }
    }, [initialData])

    return (
        <form className="row g-3 shadow p-4 rounded-3" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="mb-3 col-6">
                <label className="form-label">Name</label>
                <input
                    {...register('name', { required: 'Name is Require' })}
                    type="text"
                    className={"form-control " + (errors.name && errors.name.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.name && errors.name.message}
                </div>
            </div>
            <div className="mb-3 col-6">
                <label className="form-label">Username</label>
                <input
                    {...register('username', { required: 'Username is Require' })}
                    type={'text'}
                    className={"form-control " + (errors.username && errors.username.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.username && errors.username.message}
                </div>
            </div>
            <div className="mb-3 col-6">
                <label className="form-label">Role</label>
                <select
                    {...register('role', { required: 'Role is Require' })}
                    className={"form-control " + (errors.role && errors.role.message ? 'is-invalid' : null)}
                    defaultValue={''}
                    disabled={initialData}
                >
                    <option disabled value={''}>-- Role --</option>
                    <option value={'super'}>Super Admin</option>
                    <option value={'admin'}>Office Staff</option>
                    <option value={'staff'}>Warehouse Staff</option>
                </select>
                <div className="invalid-feedback">
                    {errors.role && errors.role.message}
                </div>
            </div>
            <div className="mb-3 col-6">
                <label className="form-label">Password</label>
                <input
                    {...register('password', { required: 'Password is Require' })}
                    type={'password'}
                    className={"form-control " + (errors.password && errors.password.message ? 'is-invalid' : null)}
                />
                <div className="invalid-feedback">
                    {errors.password && errors.password.message}
                </div>
            </div>
            <div className="col-12">
                <button className="btn btn-primary" type="submit">{title}</button>
            </div>
        </form>
    )
}

export default UserForm