import clsx from 'clsx'
import CardBlock from 'component/UI/Content/CardBlock'
import { KMInput, KMInputPassword } from 'component/UI/Content/KMInput'
import PageHeader from 'component/UI/Content/PageHeader'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Schema } from 'rsuite'
import { AuthenticateService } from 'service/authenticate'
import { LoginModel } from 'src/constant/model.constant'
import { useAuthorizationStore } from 'src/store'
import styles from './styles.module.scss'
export default function LoginPage() {
  const router = useRouter()

  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const { authenticate, changeAuthenticateStatus } = useAuthorizationStore((state) => state)

  useEffect(() => {
    if (authenticate) {
      router.push('/admin')
    }
  }, [authenticate])

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      console.log('Form Error')
      return
    }

    try {
      setLoading(true)
      const resp = await AuthenticateService.login(form)

      const data = resp?.data

      if (resp.status === 200) {
        changeAuthenticateStatus({
          authenticate: data.authenticate,
          user: data.data,
          isAdmin: data?.data?.role === 'admin',
        })
      }
    } catch (error) {
      console.log('handleSubmit', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnter = (e) => {
    if (e.which === 13) {
      return handleSubmit()
    }
  }

  return (
    <div className="row p-0">
      <div className="col-12 p-0">
        <PageHeader type="h3" left>
          Đăng nhập
        </PageHeader>
      </div>
      <div className="col-12 p-0 py-2 border-top">
        <div className="container">
          <div className="row gy-4">
            <div className={clsx(styles.loginForm)}>
              <Form formValue={form} ref={formRef} model={LoginModel} onChange={(val) => setForm({ ...val })}>
                <CardBlock>
                  <KMInput name="username" label="Tên đăng nhập" />

                  <KMInputPassword name="password" label="Password" onKeyPress={handleEnter} />

                  <Button
                    style={{ backgroundColor: 'var(--rs-blue-800)', color: '#fff' }}
                    onClick={handleSubmit}
                    loading={loading}
                  >
                    Submit
                  </Button>
                </CardBlock>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
