/**
 * Advanced Profile Features
 * 
 * Extended profile management for:
 * - Career history
 * - Education details
 * - Skills & expertise
 * - Certifications
 * - Languages
 * - Publications & projects
 */

'use client'

import React, { useState, useCallback } from 'react'

export interface AdvancedProfileProps {
  profile?: any
  onUpdateProfile?: (updates: any) => Promise<void>
}

/**
 * Career Entry Component
 */
export function CareerHistory({ profile, onUpdateProfile }: AdvancedProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  })

  const handleAdd = useCallback(async () => {
    if (!formData.company || !formData.position || !onUpdateProfile) return

    const newEntry = {
      id: `career_${Date.now()}`,
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    }

    try {
      await onUpdateProfile({
        experience: [...(profile?.experience || []), newEntry],
      })

      // Reset form
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      })
    } catch (error) {
      console.error('Failed to add career entry:', error)
    }
  }, [formData, profile, onUpdateProfile])

  return (
    <div className="career-history">
      <div className="section-header">
        <h3>Career History</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-button"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="section-content">
          {/* Career Entries */}
          <div className="entries-list">
            {profile?.experience?.map((entry: any) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-header">
                  <div>
                    <h4>{entry.position}</h4>
                    <p className="company">{entry.company}</p>
                  </div>
                  <div className="entry-date">
                    {entry.startDate && (
                      <span>
                        {new Date(entry.startDate).toLocaleDateString()}
                        {entry.endDate && !entry.current
                          ? ` - ${new Date(entry.endDate).toLocaleDateString()}`
                          : entry.current
                          ? ' - Present'
                          : ''}
                      </span>
                    )}
                  </div>
                </div>
                {entry.description && <p className="description">{entry.description}</p>}
              </div>
            ))}
          </div>

          {/* Add Form */}
          <div className="add-form">
            <h4>Add Career Entry</h4>
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="form-input"
            />
            <div className="form-row">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-input"
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-input"
                disabled={formData.current}
              />
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                />
                Current
              </label>
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
            <button onClick={handleAdd} className="btn btn-primary">
              Add Entry
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .career-history {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
        }

        .section-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .toggle-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
        }

        .section-content {
          padding: 16px;
        }

        .entries-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .entry-card {
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #4f46e5;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .entry-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .entry-header .company {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #6b7280;
        }

        .entry-date {
          text-align: right;
          font-size: 12px;
          color: #9ca3af;
          white-space: nowrap;
        }

        .description {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }

        .add-form {
          border-top: 1px solid #e5e7eb;
          padding-top: 16px;
        }

        .add-form h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .form-input,
        .form-textarea {
          display: block;
          width: 100%;
          padding: 8px 12px;
          margin-bottom: 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
          margin-bottom: 12px;
          align-items: center;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .checkbox input {
          cursor: pointer;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background-color: #4f46e5;
          color: white;
        }

        .btn-primary:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  )
}

/**
 * Skills Component
 */
export function SkillsSection({ profile, onUpdateProfile }: AdvancedProfileProps) {
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = useCallback(async () => {
    if (!newSkill.trim() || !onUpdateProfile) return

    const skill = {
      id: `skill_${Date.now()}`,
      name: newSkill,
      category: 'technical',
      level: 'intermediate',
      endorsements: 0,
    }

    try {
      await onUpdateProfile({
        skills: [...(profile?.skills || []), skill],
      })
      setNewSkill('')
    } catch (error) {
      console.error('Failed to add skill:', error)
    }
  }, [newSkill, profile, onUpdateProfile])

  return (
    <div className="skills-section">
      <h3>Skills & Expertise</h3>

      <div className="skills-grid">
        {profile?.skills?.map((skill: any) => (
          <div key={skill.id} className="skill-tag">
            <span>{skill.name}</span>
            <span className="level">{skill.level}</span>
          </div>
        ))}
      </div>

      <div className="add-skill-form">
        <input
          type="text"
          placeholder="Add a new skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="form-input"
        />
        <button onClick={handleAddSkill} className="btn btn-primary">
          Add Skill
        </button>
      </div>

      <style jsx>{`
        .skills-section {
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .skills-section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .skill-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background-color: #e0e7ff;
          color: #4f46e5;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .skill-tag .level {
          font-size: 11px;
          opacity: 0.7;
        }

        .add-skill-form {
          display: flex;
          gap: 8px;
        }

        .form-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
        }

        .btn {
          padding: 8px 16px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn:hover {
          background-color: #4338ca;
        }
      `}</style>
    </div>
  )
}

/**
 * Certifications Component
 */
export function CertificationsSection({ profile }: AdvancedProfileProps) {
  return (
    <div className="certifications-section">
      <h3>Certifications & Awards</h3>

      <div className="certifications-list">
        {profile?.certifications?.map((cert: any) => (
          <div key={cert.id} className="certification-card">
            <h4>{cert.name}</h4>
            <p className="issuer">{cert.issuer}</p>
            <p className="date">
              Issued: {new Date(cert.issueDate).toLocaleDateString()}
            </p>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                View Credential →
              </a>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .certifications-section {
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .certifications-section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .certifications-list {
          display: grid;
          gap: 12px;
        }

        .certification-card {
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        }

        .certification-card h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .certification-card .issuer {
          margin: 4px 0;
          font-size: 13px;
          color: #6b7280;
        }

        .certification-card .date {
          margin: 4px 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .certification-card a {
          display: inline-block;
          margin-top: 8px;
          color: #4f46e5;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }

        .certification-card a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default {
  CareerHistory,
  SkillsSection,
  CertificationsSection,
}
