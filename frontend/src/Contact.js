import {useState} from 'react'
import './Contact.css'
import {post} from './lib/requests'

function Contact() {
  const [name, setName] = useState('')

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState(false)

  const updateEmail = (e) => {
    setEmail(e.target.value)
  }

  const updateMessage = (e) => {
    setMessage(e.target.value)
  }

  const updateName = (e) => {
    setName(e.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!submitStatus) {
      // prepping data to send
      const data = {
        name,
        email,
        message
      }

      try {
        const response = await post('http://localhost:8000/api/email', data, false)

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // success
        setName('')
        setEmail('')
        setMessage('')
        setSubmitStatus(true)
      } catch (error) {
        console.error('Error submitting contact form:', error)
      }
    }
  }


  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <form className="contact-form" onSubmit={handleSubmit} method="POST">
          <h1>Contact Us</h1>
          <p>Let us know your thoughts!</p>

          <div className="form-group">
            <label form="name">Name</label>
            <input type="text" id="name" name="name" value={name} placeholder="Your name" onChange={updateName}
                   required></input>
          </div>

          <div className="form-group">
            <label form="email">Email</label>
            <input type="email" id="email" name="email" value={email} placeholder="Your email" onChange={updateEmail} required></input>
          </div>

          <div className="form-group">
            <label form="comments">Comments</label>
            <textarea id="comments" name="comments" value={message} placeholder="Your comments" rows="4" onChange={updateMessage}
                      required></textarea>
          </div>

          <button type="submit" class="submit-button">Submit</button>
        </form>
      </div>
    </div>

  );
}

export default Contact
